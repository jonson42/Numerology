namespace Numerology.Domain.Entities;

public class UserAccount
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string PhoneNumber { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string Role { get; set; } = "User"; // User, Admin
    public bool IsVip { get; set; } = false;
    public DateTime? VipExpireAt { get; set; }
    public string? OtpCode { get; set; }
    public DateTime? OtpExpiredAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<LookupReport> Reports { get; set; } = new List<LookupReport>();
    public ICollection<TransactionOrder> Orders { get; set; } = new List<TransactionOrder>();
}
