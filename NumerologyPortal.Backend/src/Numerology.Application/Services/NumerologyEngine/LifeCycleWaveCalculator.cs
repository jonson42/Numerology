using Numerology.Domain.ValueObjects;

namespace Numerology.Application.Services.NumerologyEngine;

public class LifeCycleWaveCalculator
{
    public static List<PersonalCycleYear> CalculateWave(DateTime birthDate, int currentYear)
    {
        var list = new List<PersonalCycleYear>();

        // Lấy dải 9 năm: từ currentYear - 3 đến currentYear + 5 (tổng cộng 9 năm)
        for (int y = currentYear - 3; y <= currentYear + 5; y++)
        {
            int personalYear = PythagorasCalculator.CalculatePersonalYear(birthDate.Day, birthDate.Month, y);
            var (phase, desc) = GetYearPhaseAndDescription(personalYear);

            list.Add(new PersonalCycleYear
            {
                Year = y,
                PersonalYearNumber = personalYear,
                Phase = phase,
                Description = desc,
                IsCurrentYear = (y == currentYear)
            });
        }

        return list;
    }

    public static (string Phase, string Description) GetYearPhaseAndDescription(int personalYear)
    {
        return personalYear switch
        {
            1 => ("Năm 1: Gieo Hạt & Khởi Đầu Mới", "Thời điểm tuyệt vời để bắt đầu những dự án mới, thay đổi công việc hoặc định hướng cuộc sống. Năng lượng tràn đầy quyết tâm và độc lập."),
            2 => ("Năm 2: Nuôi Dưỡng & Hòa Hợp", "Năm của sự lắng nghe, hợp tác, kết nối tình cảm và chờ đợi mầm cây lớn lên. Hãy kiên nhẫn và tránh nóng vội."),
            3 => ("Năm 3: Mở Rộng & Sáng Tạo", "Năng lượng bùng nổ của giao tiếp, học tập, mở rộng mối quan hệ xã hội và thể hiện tài năng sáng tạo cá nhân."),
            4 => ("Năm 4: Củng Cố & Kỷ Luật", "Năm của sự củng cố nội lực, làm việc chăm chỉ, tổ chức lại tài chính và sức khỏe. Đây là đáy sóng cần sự vững chãi."),
            5 => ("Năm 5: Bứt Phá & Tự Do", "Năm bản lề chuyển dịch lớn, đầy những biến động bất ngờ, du lịch, mở rộng cơ hội và giải phóng những rào cản cũ."),
            6 => ("Năm 6: Gia Đình & Tình Yêu", "Năm tập trung vào tổ ấm gia đình, hôn nhân, chăm sóc người thân và phát triển năng lượng tình yêu thương, sáng tạo."),
            7 => ("Năm 7: Chiêm Nghiệm & Tri Thức", "Khoảng lặng để tu dưỡng nội tâm, học hỏi kiến thức chuyên sâu, đúc kết bài học cuộc đời. Cần cẩn trọng đầu tư tài chính mạo hiểm."),
            8 => ("Năm 8: Gặt Hái & Đỉnh Cao Tài Chính", "Năm của sự tự tin, quyền lực, gặt hái thành quả tài chính và khẳng định vị thế độc lập trong sự nghiệp."),
            9 => ("Năm 9: Hoàn Tất & Chuyển Giao", "Khép lại chu kỳ 9 năm cũ, dọn dẹp những điều không còn phù hợp để chuẩn bị tâm thế đón chào chu kỳ vận số rực rỡ tiếp theo."),
            _ => ("Năm Cân Bằng", "Giai đoạn chuyển hóa tích cực.")
        };
    }
}
