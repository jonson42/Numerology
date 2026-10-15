using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Numerology.Application.Common.Interfaces;
using Numerology.Application.Common.Models;
using Numerology.Application.Features.Dtos;
using Numerology.Application.Services;
using Numerology.Domain.Entities;
using Numerology.Domain.ValueObjects;
using Numerology.Infrastructure.Persistence;

namespace Numerology.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly NumerologyDbContext _dbContext;
    private readonly IPdfReportService _pdfService;

    public ReportsController(NumerologyDbContext dbContext, IPdfReportService pdfService)
    {
        _dbContext = dbContext;
        _pdfService = pdfService;
    }

    /// <summary>
    /// Tạo mới một báo cáo tra cứu (Thần số học hoặc Thần số học cho con)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<Result<LookupReportDto>>> CreateReport([FromBody] CreateLookupRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FullName))
        {
            return BadRequest(Result<LookupReportDto>.Fail("Họ và tên không được để trống."));
        }

        // Lấy thông tin người dùng nếu có token
        Guid? userId = null;
        bool isUserVip = false;

        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (!string.IsNullOrWhiteSpace(userIdClaim) && Guid.TryParse(userIdClaim, out var parsedId))
        {
            userId = parsedId;
            var user = await _dbContext.Users.FindAsync(parsedId);
            if (user != null && user.IsVip && (!user.VipExpireAt.HasValue || user.VipExpireAt > DateTime.UtcNow))
            {
                isUserVip = true;
            }
        }

        // Lấy danh sách luận giải tùy biến từ DB
        var dbInterpretations = await _dbContext.Interpretations.ToListAsync();

        // Tính toán toàn bộ chỉ số
        var metrics = ReportAssemblerService.AssembleReport(
            request.FullName,
            request.BirthDate,
            request.ServiceType,
            isUserVip,
            dbInterpretations
        );

        // Tạo ShareToken ngẫu nhiên bảo mật (12 ký tự)
        string shareToken = Guid.NewGuid().ToString("N")[..12];

        var report = new LookupReport
        {
            FullName = request.FullName.Trim(),
            BirthDate = request.BirthDate,
            BirthTime = request.BirthTime,
            Gender = request.Gender,
            ServiceType = request.ServiceType,
            ShareToken = shareToken,
            UserId = userId,
            MetricsJson = JsonSerializer.Serialize(metrics),
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Reports.Add(report);
        await _dbContext.SaveChangesAsync();

        var dto = new LookupReportDto
        {
            Id = report.Id,
            FullName = report.FullName,
            BirthDate = report.BirthDate,
            BirthTime = report.BirthTime,
            Gender = report.Gender,
            ServiceType = report.ServiceType,
            ShareToken = report.ShareToken,
            IsVipView = isUserVip,
            Metrics = metrics,
            CreatedAt = report.CreatedAt
        };

        return Ok(Result<LookupReportDto>.Ok(dto, "Báo cáo tra cứu đã được tạo thành công!"));
    }

    /// <summary>
    /// Xem báo cáo trực tuyến thông qua Share Token (?view=token)
    /// Tự động áp dụng Paywall làm mờ server-side nếu người xem chưa mở VIP
    /// </summary>
    [HttpGet("{token}")]
    public async Task<ActionResult<Result<LookupReportDto>>> GetReportByToken(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return BadRequest(Result<LookupReportDto>.Fail("Mã báo cáo không hợp lệ."));
        }

        var report = await _dbContext.Reports.FirstOrDefaultAsync(r => r.ShareToken == token.Trim());
        if (report == null)
        {
            return NotFound(Result<LookupReportDto>.Fail("Không tìm thấy báo cáo tra cứu tương ứng."));
        }

        // Kiểm tra xem người đang xem có quyền VIP hay không
        bool isUserVip = false;
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (!string.IsNullOrWhiteSpace(userIdClaim) && Guid.TryParse(userIdClaim, out var parsedId))
        {
            var user = await _dbContext.Users.FindAsync(parsedId);
            if (user != null && user.IsVip && (!user.VipExpireAt.HasValue || user.VipExpireAt > DateTime.UtcNow))
            {
                isUserVip = true;
            }
        }

        // Nếu báo cáo thuộc về một User đã mua VIP, cho phép xem mở khóa
        if (report.UserId.HasValue)
        {
            var owner = await _dbContext.Users.FindAsync(report.UserId.Value);
            if (owner != null && owner.IsVip && (!owner.VipExpireAt.HasValue || owner.VipExpireAt > DateTime.UtcNow))
            {
                isUserVip = true;
            }
        }

        var dbInterpretations = await _dbContext.Interpretations.ToListAsync();
        var metrics = ReportAssemblerService.AssembleReport(
            report.FullName,
            report.BirthDate,
            report.ServiceType,
            isUserVip,
            dbInterpretations
        );

        var dto = new LookupReportDto
        {
            Id = report.Id,
            FullName = report.FullName,
            BirthDate = report.BirthDate,
            BirthTime = report.BirthTime,
            Gender = report.Gender,
            ServiceType = report.ServiceType,
            ShareToken = report.ShareToken,
            IsVipView = isUserVip,
            Metrics = metrics,
            CreatedAt = report.CreatedAt
        };

        return Ok(Result<LookupReportDto>.Ok(dto));
    }

    /// <summary>
    /// Xuất file PDF báo cáo chuẩn chất lượng cao
    /// </summary>
    [HttpGet("{token}/pdf")]
    public async Task<IActionResult> ExportPdf(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return BadRequest("Mã báo cáo không hợp lệ.");
        }

        var report = await _dbContext.Reports.FirstOrDefaultAsync(r => r.ShareToken == token.Trim());
        if (report == null)
        {
            return NotFound("Không tìm thấy báo cáo.");
        }

        var dbInterpretations = await _dbContext.Interpretations.ToListAsync();
        var metrics = ReportAssemblerService.AssembleReport(
            report.FullName,
            report.BirthDate,
            report.ServiceType,
            true, // Bản PDF xuất đầy đủ các chỉ số
            dbInterpretations
        );

        byte[] pdfBytes = _pdfService.GenerateReportPdf(report.FullName, report.BirthDate, metrics);
        string filename = $"BaoCao_ThanSoHoc_{report.FullName.Replace(" ", "_")}.pdf";

        return File(pdfBytes, "application/pdf", filename);
    }
}
