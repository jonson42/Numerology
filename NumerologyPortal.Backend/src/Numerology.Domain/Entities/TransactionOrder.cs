using Numerology.Domain.Enums;

namespace Numerology.Domain.Entities;

public class TransactionOrder
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string OrderCode { get; set; } = string.Empty; // Mã đơn hàng ngắn gọn dễ ghi nội dung chuyển khoản, ví dụ: "VIP102938"
    public Guid? UserId { get; set; }
    public UserAccount? User { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;

    public decimal Amount { get; set; }
    public string PackageName { get; set; } = "Gói VIP 1 Năm"; // Gói VIP 1 Năm, Gói VIP Trọn Đời
    public int VipDays { get; set; } = 365;

    public OrderStatusEnum Status { get; set; } = OrderStatusEnum.Pending;
    public string PaymentGateway { get; set; } = "VietQR_SePay";
    public string TransferContent { get; set; } = string.Empty; // Nội dung chuyển khoản yêu cầu (ví dụ: "VIP 102938")
    public string? SePayTransactionId { get; set; } // ID giao dịch từ SePay webhook
    public string? BankSubAccount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PaidAt { get; set; }
}
