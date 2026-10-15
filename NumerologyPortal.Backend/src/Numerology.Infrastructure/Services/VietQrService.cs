using System.Web;
using Microsoft.Extensions.Configuration;
using Numerology.Application.Common.Interfaces;
using Numerology.Domain.Entities;

namespace Numerology.Infrastructure.Services;

public class VietQrService : IVietQrService
{
    private readonly IConfiguration _configuration;

    public VietQrService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public VietQrPaymentInfo GeneratePaymentInfo(TransactionOrder order)
    {
        string bankCode = _configuration["Payment:VietQr:BankCode"] ?? "MB";
        string bankName = _configuration["Payment:VietQr:BankName"] ?? "Ngân hàng Quân Đội (MBBank)";
        string accountNumber = _configuration["Payment:VietQr:AccountNumber"] ?? "0901234567";
        string accountName = _configuration["Payment:VietQr:AccountName"] ?? "CONG TY CONG NGHE TRA CUU";

        // Tạo nội dung chuyển khoản chuẩn theo OrderCode
        string transferContent = order.TransferContent;
        if (string.IsNullOrWhiteSpace(transferContent))
        {
            transferContent = $"VIP {order.OrderCode}";
        }

        string encodedAccountName = HttpUtility.UrlEncode(accountName);
        string encodedContent = HttpUtility.UrlEncode(transferContent);

        // Chuẩn VietQR QuickLink định dạng ảnh compact2
        string qrUrl = $"https://img.vietqr.io/image/{bankCode}-{accountNumber}-compact2.png?amount={(long)order.Amount}&addInfo={encodedContent}&accountName={encodedAccountName}";

        return new VietQrPaymentInfo
        {
            OrderCode = order.OrderCode,
            Amount = order.Amount,
            BankCode = bankCode,
            BankName = bankName,
            AccountNumber = accountNumber,
            AccountName = accountName,
            TransferContent = transferContent,
            QrImageUrl = qrUrl
        };
    }
}
