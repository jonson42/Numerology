using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Numerology.Application.Common.Interfaces;
using Numerology.Application.Common.Models;
using Numerology.Application.Features.Dtos;
using Numerology.Domain.Entities;
using Numerology.Domain.Enums;
using Numerology.Infrastructure.Persistence;

namespace Numerology.Api.Controllers;

public class OrderDetailResponse
{
    public string OrderCode { get; set; } = string.Empty;
    public string PackageName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public VietQrPaymentInfo VietQrInfo { get; set; } = new();
}

public class OrderStatusCheckResponse
{
    public string OrderCode { get; set; } = string.Empty;
    public bool IsPaid { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsVip { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly NumerologyDbContext _dbContext;
    private readonly IVietQrService _vietQrService;
    private readonly ISePayService _sePayService;

    public PaymentsController(
        NumerologyDbContext dbContext,
        IVietQrService vietQrService,
        ISePayService sePayService)
    {
        _dbContext = dbContext;
        _vietQrService = vietQrService;
        _sePayService = sePayService;
    }

    /// <summary>
    /// Tạo đơn hàng nâng cấp VIP và sinh mã QR VietQR tự động
    /// </summary>
    [HttpPost("create-order")]
    public async Task<ActionResult<Result<OrderDetailResponse>>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            return BadRequest(Result<OrderDetailResponse>.Fail("Số điện thoại là bắt buộc."));
        }

        string cleanPhone = request.PhoneNumber.Trim().Replace(" ", "");

        // Lấy User nếu đã có trong hệ thống hoặc đăng nhập
        UserAccount? user = null;
        try
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (!string.IsNullOrWhiteSpace(userIdClaim) && Guid.TryParse(userIdClaim, out var parsedId))
            {
                user = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == parsedId);
            }

            if (user == null)
            {
                user = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.PhoneNumber == cleanPhone);
            }
        }
        catch
        {
            // Bỏ qua lỗi truy vấn user nếu có bất đồng bộ schema trên DB
        }

        decimal amount = 199000; // Mặc định gói 1 năm 199.000 VNĐ
        string packageName = "Gói VIP 1 Năm";
        int vipDays = 365;

        if (request.PackageType == "LIFETIME")
        {
            amount = 399000;
            packageName = "Gói VIP Trọn Đời";
            vipDays = 3650; // 10 năm
        }

        // Tạo mã đơn hàng độc nhất dạng số ngẫu nhiên 6 chữ số
        string randomDigits = new Random().Next(100000, 999999).ToString();
        string orderCode = $"VIP{randomDigits}";
        string transferContent = $"VIP {randomDigits}";

        var order = new TransactionOrder
        {
            OrderCode = orderCode,
            PhoneNumber = cleanPhone,
            UserId = user?.Id,
            Amount = amount,
            PackageName = packageName,
            VipDays = vipDays,
            Status = OrderStatusEnum.Pending,
            TransferContent = transferContent,
            CreatedAt = DateTime.UtcNow
        };

        try
        {
            _dbContext.Orders.Add(order);
            await _dbContext.SaveChangesAsync();
        }
        catch
        {
            try
            {
                _dbContext.Entry(order).State = EntityState.Detached;
                order.UserId = null;
                order.User = null;
                _dbContext.Orders.Add(order);
                await _dbContext.SaveChangesAsync();
            }
            catch
            {
                // Vẫn tiếp tục trả mã QR để không chặn người dùng
            }
        }

        var qrInfo = _vietQrService.GeneratePaymentInfo(order);

        var response = new OrderDetailResponse
        {
            OrderCode = order.OrderCode,
            PackageName = order.PackageName,
            Amount = order.Amount,
            Status = order.Status.ToString(),
            VietQrInfo = qrInfo
        };

        return Ok(Result<OrderDetailResponse>.Ok(response, "Đơn hàng đã được khởi tạo thành công!"));
    }

    /// <summary>
    /// Webhook tiếp nhận thông báo chuyển khoản ngân hàng từ SePay
    /// </summary>
    [HttpPost("sepay-webhook")]
    public async Task<IActionResult> SePayWebhook([FromBody] SePayWebhookPayload payload)
    {
        try
        {
            bool success = await _sePayService.ProcessIncomingWebhookAsync(payload);
            return Ok(new { success, message = success ? "Xử lý nâng cấp VIP thành công" : "Bỏ qua hoặc không khớp đơn hàng" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, error = ex.Message });
        }
    }

    /// <summary>
    /// Kiểm tra trạng thái thanh toán đơn hàng (Frontend Polling)
    /// </summary>
    [HttpGet("check-order/{orderCode}")]
    public async Task<ActionResult<Result<OrderStatusCheckResponse>>> CheckOrderStatus(string orderCode)
    {
        var order = await _dbContext.Orders
            .AsNoTracking()
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.OrderCode == orderCode.Trim());

        if (order == null)
        {
            return NotFound(Result<OrderStatusCheckResponse>.Fail("Không tìm thấy đơn hàng."));
        }

        bool isPaid = order.Status == OrderStatusEnum.Success;
        bool isVip = order.User?.IsVip ?? false;

        return Ok(Result<OrderStatusCheckResponse>.Ok(new OrderStatusCheckResponse
        {
            OrderCode = order.OrderCode,
            IsPaid = isPaid,
            Status = order.Status.ToString(),
            IsVip = isVip
        }));
    }

    /// <summary>
    /// Kích hoạt thanh toán thành công tức thì (Dành cho Demo / Môi trường phát triển)
    /// </summary>
    [HttpPost("simulate-success/{orderCode}")]
    public async Task<ActionResult<Result<string>>> SimulatePaymentSuccess(string orderCode)
    {
        var order = await _dbContext.Orders
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.OrderCode == orderCode.Trim());

        if (order == null)
        {
            return NotFound(Result<string>.Fail("Không tìm thấy đơn hàng."));
        }

        order.Status = OrderStatusEnum.Success;
        order.PaidAt = DateTime.UtcNow;
        order.SePayTransactionId = "SIMULATED_" + Guid.NewGuid().ToString("N")[..8];

        UserAccount? user = order.User;
        if (user == null && !string.IsNullOrWhiteSpace(order.PhoneNumber))
        {
            user = await _dbContext.Users.FirstOrDefaultAsync(u => u.PhoneNumber == order.PhoneNumber);
            if (user == null)
            {
                user = new UserAccount
                {
                    PhoneNumber = order.PhoneNumber,
                    Role = "User",
                    IsVip = true,
                    CreatedAt = DateTime.UtcNow
                };
                _dbContext.Users.Add(user);
            }
            order.UserId = user.Id;
            order.User = user;
        }

        if (user != null)
        {
            user.IsVip = true;
            DateTime currentExpire = user.VipExpireAt.HasValue && user.VipExpireAt > DateTime.UtcNow
                ? user.VipExpireAt.Value
                : DateTime.UtcNow;
            user.VipExpireAt = currentExpire.AddDays(order.VipDays);
        }

        await _dbContext.SaveChangesAsync();

        return Ok(Result<string>.Ok("Mô phỏng thanh toán thành công!", "Tài khoản đã được nâng cấp VIP!"));
    }
}
