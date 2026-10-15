using Numerology.Domain.Entities;

namespace Numerology.Application.Common.Interfaces;

public class VietQrPaymentInfo
{
    public string OrderCode { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string BankName { get; set; } = string.Empty;
    public string BankCode { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string AccountName { get; set; } = string.Empty;
    public string TransferContent { get; set; } = string.Empty;
    public string QrImageUrl { get; set; } = string.Empty;
}

public interface IVietQrService
{
    VietQrPaymentInfo GeneratePaymentInfo(TransactionOrder order);
}

public class SePayWebhookPayload
{
    public long id { get; set; }
    public string? gateway { get; set; }
    public string? transactionDate { get; set; }
    public string? accountNumber { get; set; }
    public string? code { get; set; }
    public string? content { get; set; }
    public string? transferType { get; set; } // "in", "out"
    public decimal transferAmount { get; set; }
    public decimal accumulated { get; set; }
    public string? subAccount { get; set; }
    public string? referenceCode { get; set; }
    public string? description { get; set; }
}

public interface ISePayService
{
    Task<bool> ProcessIncomingWebhookAsync(SePayWebhookPayload payload);
}
