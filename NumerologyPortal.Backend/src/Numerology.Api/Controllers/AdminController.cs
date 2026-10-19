using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Numerology.Application.Common.Models;
using Numerology.Application.Features.Dtos;
using Numerology.Domain.Entities;
using Numerology.Domain.Enums;
using Numerology.Infrastructure.Persistence;

namespace Numerology.Api.Controllers;

public class UpdateInterpretationDto
{
    public string Title { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string ContentHtml { get; set; } = string.Empty;
    public bool IsVipOnly { get; set; }
}

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly NumerologyDbContext _dbContext;

    public AdminController(NumerologyDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Thống kê Dashboard tổng quan hệ thống
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<ActionResult<Result<DashboardStatsDto>>> GetDashboardStats()
    {
        int totalUsers = await _dbContext.Users.CountAsync();
        int totalVipUsers = await _dbContext.Users.CountAsync(u => u.IsVip);
        int totalReports = await _dbContext.Reports.CountAsync();
        int totalOrders = await _dbContext.Orders.CountAsync();
        var paidAmounts = await _dbContext.Orders
            .Where(o => o.Status == OrderStatusEnum.Success)
            .Select(o => o.Amount)
            .ToListAsync();
        decimal totalRevenue = paidAmounts.Sum();

        var recentOrders = await _dbContext.Orders
            .OrderByDescending(o => o.CreatedAt)
            .Take(10)
            .Select(o => new RecentOrderDto
            {
                OrderCode = o.OrderCode,
                PhoneNumber = o.PhoneNumber,
                Amount = o.Amount,
                Status = o.Status.ToString(),
                CreatedAt = o.CreatedAt
            })
            .ToListAsync();

        var stats = new DashboardStatsDto
        {
            TotalUsers = totalUsers,
            TotalVipUsers = totalVipUsers,
            TotalReports = totalReports,
            TotalOrders = totalOrders,
            TotalRevenue = totalRevenue,
            RecentOrders = recentOrders
        };

        return Ok(Result<DashboardStatsDto>.Ok(stats));
    }

    /// <summary>
    /// Lấy danh sách kho nội dung luận giải
    /// </summary>
    [HttpGet("interpretations")]
    public async Task<ActionResult<Result<List<InterpretationMaster>>>> GetInterpretations([FromQuery] ServiceTypeEnum? serviceType)
    {
        var query = _dbContext.Interpretations.AsQueryable();
        if (serviceType.HasValue)
        {
            query = query.Where(i => i.ServiceType == serviceType.Value);
        }

        var list = await query.OrderBy(i => i.SortOrder).ToListAsync();
        return Ok(Result<List<InterpretationMaster>>.Ok(list));
    }

    /// <summary>
    /// Cập nhật nội dung luận giải
    /// </summary>
    [HttpPut("interpretations/{id}")]
    public async Task<ActionResult<Result<string>>> UpdateInterpretation(Guid id, [FromBody] UpdateInterpretationDto dto)
    {
        var item = await _dbContext.Interpretations.FindAsync(id);
        if (item == null)
        {
            return NotFound(Result<string>.Fail("Không tìm thấy nội dung luận giải."));
        }

        item.Title = dto.Title;
        item.Summary = dto.Summary;
        item.ContentHtml = dto.ContentHtml;
        item.IsVipOnly = dto.IsVipOnly;
        item.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return Ok(Result<string>.Ok("Cập nhật thành công!", "Nội dung luận giải đã được lưu."));
    }

    /// <summary>
    /// Lấy danh sách đơn hàng
    /// </summary>
    [HttpGet("orders")]
    public async Task<ActionResult<Result<List<TransactionOrder>>>> GetOrders()
    {
        var orders = await _dbContext.Orders
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .Take(50)
            .ToListAsync();

        return Ok(Result<List<TransactionOrder>>.Ok(orders));
    }

    /// <summary>
    /// Lấy danh sách thành viên & quản lý VIP
    /// </summary>
    [HttpGet("users")]
    public async Task<ActionResult<Result<List<UserAccount>>>> GetUsers()
    {
        var users = await _dbContext.Users
            .AsNoTracking()
            .OrderByDescending(u => u.CreatedAt)
            .Take(50)
            .ToListAsync();

        return Ok(Result<List<UserAccount>>.Ok(users));
    }

    /// <summary>
    /// Bật/tắt trạng thái VIP cho thành viên thủ công
    /// </summary>
    [HttpPost("users/{id}/toggle-vip")]
    public async Task<ActionResult<Result<bool>>> ToggleUserVip(Guid id)
    {
        var user = await _dbContext.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound(Result<bool>.Fail("Không tìm thấy người dùng."));
        }

        user.IsVip = !user.IsVip;
        if (user.IsVip)
        {
            user.VipExpireAt = DateTime.UtcNow.AddYears(1);
        }
        else
        {
            user.VipExpireAt = null;
        }

        user.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        return Ok(Result<bool>.Ok(user.IsVip, $"Đã cập nhật trạng thái VIP thành công ({user.IsVip})."));
    }
}
