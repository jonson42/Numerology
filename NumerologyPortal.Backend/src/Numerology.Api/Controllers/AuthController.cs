using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Numerology.Application.Common.Interfaces;
using Numerology.Application.Common.Models;
using Numerology.Application.Features.Dtos;
using Numerology.Domain.Entities;
using Numerology.Infrastructure.Persistence;

using Numerology.Application.Common;

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
    /// Đăng nhập tài khoản bằng Tên đăng nhập / Số điện thoại và Mật khẩu
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<Result<AuthResponseDto>>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(Result<AuthResponseDto>.Fail("Vui lòng nhập tên đăng nhập và mật khẩu."));
        }

        string username = request.Username.Trim();
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => 
            u.Username == username || u.PhoneNumber == username);

        if (user == null)
        {
            return BadRequest(Result<AuthResponseDto>.Fail("Tên đăng nhập hoặc mật khẩu không chính xác."));
        }

        bool isValid = false;
        if (!string.IsNullOrWhiteSpace(user.PasswordHash))
        {
            isValid = PasswordHelper.VerifyPassword(request.Password, user.PasswordHash);
        }
        else
        {
            // Tài khoản cũ hoặc tạo trước khi có password: hỗ trợ mật khẩu 123456
            isValid = request.Password == "123456";
        }

        if (!isValid)
        {
            return BadRequest(Result<AuthResponseDto>.Fail("Tên đăng nhập hoặc mật khẩu không chính xác."));
        }

        string token = _tokenGenerator.GenerateToken(user);
        var dto = new AuthResponseDto
        {
            Token = token,
            User = new UserAccountDto
            {
                Id = user.Id,
                Username = user.Username,
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                Role = user.Role,
                IsVip = user.IsVip && (!user.VipExpireAt.HasValue || user.VipExpireAt > DateTime.UtcNow),
                VipExpireAt = user.VipExpireAt
            }
        };

        return Ok(Result<AuthResponseDto>.Ok(dto, "Đăng nhập thành công!"));
    }

    /// <summary>
    /// Đăng ký tài khoản mới bằng Tên đăng nhập và Mật khẩu
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<Result<AuthResponseDto>>> Register([FromBody] RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username))
        {
            return BadRequest(Result<AuthResponseDto>.Fail("Tên đăng nhập không được để trống."));
        }

        string username = request.Username.Trim();
        if (username.Length < 3)
        {
            return BadRequest(Result<AuthResponseDto>.Fail("Tên đăng nhập phải có ít nhất 3 ký tự."));
        }

        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
        {
            return BadRequest(Result<AuthResponseDto>.Fail("Mật khẩu phải có ít nhất 6 ký tự."));
        }

        bool exists = await _dbContext.Users.AnyAsync(u => u.Username == username);
        if (exists)
        {
            return BadRequest(Result<AuthResponseDto>.Fail("Tên đăng nhập này đã được sử dụng."));
        }

        string phone = !string.IsNullOrWhiteSpace(request.PhoneNumber)
            ? request.PhoneNumber.Trim().Replace(" ", "")
            : username;

        var user = new UserAccount
        {
            Username = username,
            PasswordHash = PasswordHelper.HashPassword(request.Password),
            PhoneNumber = phone,
            FullName = !string.IsNullOrWhiteSpace(request.FullName) ? request.FullName.Trim() : username,
            Role = "User",
            IsVip = false,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        string token = _tokenGenerator.GenerateToken(user);
        var dto = new AuthResponseDto
        {
            Token = token,
            User = new UserAccountDto
            {
                Id = user.Id,
                Username = user.Username,
                PhoneNumber = user.PhoneNumber,
                FullName = user.FullName,
                Role = user.Role,
                IsVip = false,
                VipExpireAt = null
            }
        };

        return Ok(Result<AuthResponseDto>.Ok(dto, "Đăng ký tài khoản thành công!"));
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
