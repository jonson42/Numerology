using Microsoft.EntityFrameworkCore;
using Numerology.Domain.Entities;
using Numerology.Domain.Enums;
using Numerology.Infrastructure.Persistence;

using Numerology.Application.Common;

namespace Numerology.Infrastructure.Seeders;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(NumerologyDbContext context)
    {
        await context.Database.EnsureCreatedAsync();

        // Tự động bổ sung cột Username và PasswordHash nếu dùng DB cũ chưa có migration
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE Users ADD COLUMN Username TEXT;"); } catch { }
        try { await context.Database.ExecuteSqlRawAsync("ALTER TABLE Users ADD COLUMN PasswordHash TEXT;"); } catch { }

        // 1. Seed Users
        if (!await context.Users.AnyAsync())
        {
            var admin = new UserAccount
            {
                Username = "admin",
                PasswordHash = PasswordHelper.HashPassword("admin123"),
                PhoneNumber = "0988888888",
                FullName = "Quản Trị Viên Hệ Thống",
                Role = "Admin",
                IsVip = true,
                VipExpireAt = DateTime.UtcNow.AddYears(10),
            };

            var testUser = new UserAccount
            {
                Username = "nguyenvanan",
                PasswordHash = PasswordHelper.HashPassword("123456"),
                PhoneNumber = "0912345678",
                FullName = "Nguyễn Văn An",
                Role = "User",
                IsVip = false,
            };

            context.Users.AddRange(admin, testUser);
            await context.SaveChangesAsync();
        }

        // 2. Seed System Settings
        if (!await context.SystemSettings.AnyAsync())
        {
            context.SystemSettings.AddRange(
                new SystemSetting { Key = "VietQr:BankCode", Value = "970423", Description = "Mã ngân hàng nhận thanh toán VietQR" },
                new SystemSetting { Key = "VietQr:BankName", Value = "Ngân hàng Tiên Phong (TPBank)", Description = "Tên ngân hàng" },
                new SystemSetting { Key = "VietQr:AccountNumber", Value = "56904021993", Description = "Số tài khoản ngân hàng thụ hưởng" },
                new SystemSetting { Key = "VietQr:AccountName", Value = "TrinhQuocNghiem", Description = "Tên chủ tài khoản" },
                new SystemSetting { Key = "Price:Vip1Year", Value = "199000", Description = "Giá gói VIP 1 năm (VND)" },
                new SystemSetting { Key = "Price:VipLifetime", Value = "399000", Description = "Giá gói VIP trọn đời (VND)" }
            );
            await context.SaveChangesAsync();
        }

        // 3. Seed InterpretationMaster (Kho dữ liệu luận giải)
        if (!await context.Interpretations.AnyAsync())
        {
            var interpretations = new List<InterpretationMaster>();

            // Số chủ đạo 1 đến 9, 11, 22, 33
            int[] lifePaths = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 33 };
            foreach (var lp in lifePaths)
            {
                interpretations.Add(new InterpretationMaster
                {
                    ServiceType = ServiceTypeEnum.Numerology,
                    IndicatorCode = "LIFE_PATH",
                    IndicatorName = "Số Chủ Đạo (Đường Đời)",
                    NumberKey = lp.ToString(),
                    Title = $"Số Chủ Đạo {lp}: Luận Giải Chi Tiết Bản Mệnh",
                    Summary = $"Khám phá hành trình định mệnh, năng lực tiềm ẩn và cơ hội thăng tiến của người mang số chủ đạo {lp}.",
                    ContentHtml = $"<p>Người mang con số chủ đạo <strong>{lp}</strong> sở hữu những rung động tần số vũ trụ vô cùng đặc biệt. Khi thấu hiểu được con số này, bạn sẽ làm chủ mọi quyết định lớn trong cuộc sống và tối ưu hóa tài lộc, sự nghiệp của mình.</p>",
                    IsVipOnly = false,
                    SortOrder = lp
                });
            }

            // Các chỉ số chuyên sâu VIP
            interpretations.Add(new InterpretationMaster
            {
                ServiceType = ServiceTypeEnum.Numerology,
                IndicatorCode = "MATURITY",
                IndicatorName = "Chỉ số Trưởng Thành",
                NumberKey = "ALL",
                Title = "Chỉ số Trưởng Thành & Đỉnh Cao Sự Nghiệp Tuổi Trung Niên",
                Summary = "Bật mí những thành tựu rực rỡ và tài vận của bạn từ sau ngưỡng tuổi 35 trở đi.",
                ContentHtml = "<p>Chỉ số Trưởng thành là điểm giao thoa giữa Số Chủ Đạo và Sứ Mệnh. Khi bước qua tuổi 35, bạn sẽ cảm nhận rõ rệt sự chín muồi trong tư duy, các mối quan hệ quý nhân xuất hiện nhiều hơn và tài chính gia tăng đột biến.</p>",
                IsVipOnly = true,
                SortOrder = 20
            });

            interpretations.Add(new InterpretationMaster
            {
                ServiceType = ServiceTypeEnum.Numerology,
                IndicatorCode = "PYRAMID_PEAKS",
                IndicatorName = "Kim Tự Tháp 4 Đỉnh Cao",
                NumberKey = "ALL",
                Title = "Bí Mật 4 Đỉnh Cao Kim Tự Tháp & 4 Thử Thách",
                Summary = "Bản đồ thời vận 36 năm huy hoàng nhất đời người.",
                ContentHtml = "<p>Mỗi đỉnh cao trong Kim tự tháp Pythagoras đại diện cho một chu kỳ 9 năm gặt hái đại vận. Nếu nắm bắt đúng thời điểm, bạn sẽ đón nhận những cơ hội thăng tiến vượt bậc.</p>",
                IsVipOnly = true,
                SortOrder = 30
            });

            context.Interpretations.AddRange(interpretations);
            await context.SaveChangesAsync();
        }
    }
}
