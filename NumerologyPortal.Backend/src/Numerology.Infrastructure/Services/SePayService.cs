using Microsoft.EntityFrameworkCore;
using Numerology.Application.Common.Interfaces;
using Numerology.Domain.Entities;
using Numerology.Domain.Enums;
using Numerology.Infrastructure.Persistence;

namespace Numerology.Infrastructure.Services;

public class SePayService : ISePayService
{
    private readonly NumerologyDbContext _dbContext;

    public SePayService(NumerologyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<bool> ProcessIncomingWebhookAsync(SePayWebhookPayload payload)
    {
        if (payload == null || string.IsNullOrWhiteSpace(payload.content))
        {
            return false;
        }

        string rawContent = payload.content.ToUpperInvariant();

        // Tìm đơn hàng khớp theo OrderCode hoặc TransferContent
        var pendingOrders = await _dbContext.Orders
            .Include(o => o.User)
            .Where(o => o.Status == OrderStatusEnum.Pending)
            .ToListAsync();

        TransactionOrder? matchedOrder = null;

        foreach (var order in pendingOrders)
        {
            string orderCode = order.OrderCode.ToUpperInvariant();
            string transferContent = order.TransferContent.ToUpperInvariant().Replace(" ", "");
            string cleanContent = rawContent.Replace(" ", "");

            if (rawContent.Contains(orderCode) || cleanContent.Contains(transferContent))
            {
                matchedOrder = order;
                break;
            }
        }

        if (matchedOrder == null)
        {
            return false;
        }

        // Cập nhật trạng thái đơn hàng thành công
        matchedOrder.Status = OrderStatusEnum.Success;
        matchedOrder.PaidAt = DateTime.UtcNow;
        matchedOrder.SePayTransactionId = payload.id.ToString();
        matchedOrder.BankSubAccount = payload.subAccount ?? payload.accountNumber;

        // Kích hoạt VIP cho người dùng
        UserAccount? user = matchedOrder.User;

        if (user == null && !string.IsNullOrWhiteSpace(matchedOrder.PhoneNumber))
        {
            user = await _dbContext.Users.FirstOrDefaultAsync(u => u.PhoneNumber == matchedOrder.PhoneNumber);
            if (user == null)
            {
                user = new UserAccount
                {
                    PhoneNumber = matchedOrder.PhoneNumber,
                    Role = "User",
                    IsVip = true,
                    CreatedAt = DateTime.UtcNow
                };
                _dbContext.Users.Add(user);
            }
            matchedOrder.UserId = user.Id;
            matchedOrder.User = user;
        }

        if (user != null)
        {
            user.IsVip = true;
            DateTime currentExpire = user.VipExpireAt.HasValue && user.VipExpireAt > DateTime.UtcNow
                ? user.VipExpireAt.Value
                : DateTime.UtcNow;

            user.VipExpireAt = currentExpire.AddDays(matchedOrder.VipDays);
            user.UpdatedAt = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync();
        return true;
    }
}
