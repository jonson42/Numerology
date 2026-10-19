using Numerology.Domain.Enums;
using Numerology.Domain.ValueObjects;

namespace Numerology.Application.Features.Dtos;

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }
}

public class LoginPhoneRequest
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string? FullName { get; set; }
}

public class VerifyOtpRequest
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string OtpCode { get; set; } = string.Empty;
}

public class UserAccountDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string Role { get; set; } = "User";
    public bool IsVip { get; set; }
    public DateTime? VipExpireAt { get; set; }
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserAccountDto User { get; set; } = new();
}

public class CreateLookupRequest
{
    public string FullName { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public string? BirthTime { get; set; }
    public string? Gender { get; set; }
    public ServiceTypeEnum ServiceType { get; set; } = ServiceTypeEnum.Numerology;
}

public class LookupReportDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public string? BirthTime { get; set; }
    public string? Gender { get; set; }
    public ServiceTypeEnum ServiceType { get; set; }
    public string ShareToken { get; set; } = string.Empty;
    public bool IsVipView { get; set; }
    public NumerologyMetrics Metrics { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class CreateOrderRequest
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string PackageType { get; set; } = "1_YEAR"; // "1_YEAR", "LIFETIME"
}

public class DashboardStatsDto
{
    public int TotalUsers { get; set; }
    public int TotalVipUsers { get; set; }
    public int TotalReports { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public List<RecentOrderDto> RecentOrders { get; set; } = new();
}

public class RecentOrderDto
{
    public string OrderCode { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
