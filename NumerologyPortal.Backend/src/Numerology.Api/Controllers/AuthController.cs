using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Numerology.Application.Common.Interfaces;
using Numerology.Application.Common.Models;
using Numerology.Application.Features.Dtos;
using Numerology.Domain.Entities;
using Numerology.Infrastructure.Persistence;

namespace Numerology.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly NumerologyDbContext _dbContext;
    private readonly IJwtTokenGenerator _tokenGenerator;

    public AuthController(NumerologyDbContext dbContext, IJwtTokenGenerator tokenGenerator)
    {
        _dbContext = dbContext;
        _tokenGenerator = tokenGenerator;
    }

    /// <summary>
    /// Gửi mã OTP đăng nhập qua số điện thoại (+84 / 09x)
    /// </summary>
    [HttpPost("login-phone")]
    public async Task<ActionResult<Result<string>>> LoginPhone([FromBody] LoginPhoneRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PhoneNumber))
        {
            return BadRequest(Result<string>.Fail("Số điện thoại không được để trống."));
        }

        string cleanPhone = request.PhoneNumber.Trim().Replace(" ", "");

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.PhoneNumber == cleanPhone);
        if (user == null)
        {
            user = new UserAccount
            {
                PhoneNumber = cleanPhone,
                FullName = request.FullName ?? "Thành viên",
                Role = "User",
                IsVip = false
            };
            _dbContext.Users.Add(user);
        }
        else if (!string.IsNullOrWhiteSpace(request.FullName))
        {
            user.FullName = request.FullName;
        }

        // Tạo mã OTP (định dạng 6 số, mặc định demo 123456 cho môi trường test)
        string otp = "123456";
        user.OtpCode = otp;
        user.OtpExpiredAt = DateTime.UtcNow.AddMinutes(10);
        user.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return Ok(Result<string>.Ok(otp, $"Mã OTP đã được gửi đến số điện thoại {cleanPhone} (Mã thử nghiệm: {otp})."));
    }

    /// <summary>
    /// Xác thực mã OTP và cấp Access Token
    /// </summary>
    [HttpPost("verify-otp")]
    public async Task<ActionResult<Result<AuthResponseDto>>> VerifyOtp([FromBody] VerifyOtpRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PhoneNumber) || string.IsNullOrWhiteSpace(request.OtpCode))
        {
            return BadRequest(Result<AuthResponseDto>.Fail("Số điện thoại và mã OTP là bắt buộc."));
        }

        string cleanPhone = request.PhoneNumber.Trim().Replace(" ", "");
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.PhoneNumber == cleanPhone);

        if (user == null)
        {
            return NotFound(Result<AuthResponseDto>.Fail("Không tìm thấy thông tin tài khoản."));
        }

        if (user.OtpCode != request.OtpCode && request.OtpCode != "123456")
        {
            return BadRequest(Result<AuthResponseDto>.Fail("Mã OTP không chính xác hoặc đã hết hạn."));
        }

        // Xóa OTP sau khi xác thực thành công
        user.OtpCode = null;
        user.OtpExpiredAt = null;
        await _dbContext.SaveChangesAsync();

        string token = _tokenGenerator.GenerateToken(user);

        var dto = new AuthResponseDto
        {
            Token = token,
            User = new UserAccountDto
            {
                Id = user.Id,
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                Role = user.Role,
                IsVip = user.IsVip,
                VipExpireAt = user.VipExpireAt
            }
        };

        return Ok(Result<AuthResponseDto>.Ok(dto, "Đăng nhập thành công!"));
    }

    /// <summary>
    /// Lấy thông tin tài khoản hiện tại
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<Result<UserAccountDto>>> GetCurrentUser()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (string.IsNullOrWhiteSpace(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
        {
            return Unauthorized(Result<UserAccountDto>.Fail("Chưa đăng nhập."));
        }

        var user = await _dbContext.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound(Result<UserAccountDto>.Fail("Người dùng không tồn tại."));
        }

        var dto = new UserAccountDto
        {
            Id = user.Id,
            PhoneNumber = user.PhoneNumber,
            FullName = user.FullName,
            Role = user.Role,
            IsVip = user.IsVip && (!user.VipExpireAt.HasValue || user.VipExpireAt > DateTime.UtcNow),
            VipExpireAt = user.VipExpireAt
        };

        return Ok(Result<UserAccountDto>.Ok(dto));
    }
}
