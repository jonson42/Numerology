using Numerology.Domain.ValueObjects;

namespace Numerology.Application.Services.NumerologyEngine;

public class PyramidPeakCalculator
{
    public static PyramidPeakData CalculatePyramid(DateTime birthDate, int lifePathNumber)
    {
        var result = new PyramidPeakData();

        var (m, _) = PythagorasCalculator.ReduceNumber(birthDate.Month, false);
        var (d, _) = PythagorasCalculator.ReduceNumber(birthDate.Day, false);
        var (y, _) = PythagorasCalculator.ReduceNumber(birthDate.Year, false);

        // 4 Đỉnh cao (Peaks)
        var (p1, _) = PythagorasCalculator.ReduceNumber(m + d, true);
        var (p2, _) = PythagorasCalculator.ReduceNumber(d + y, true);
        var (p3, _) = PythagorasCalculator.ReduceNumber(p1 + p2, true);
        var (p4, _) = PythagorasCalculator.ReduceNumber(m + y, true);

        // 4 Thử thách (Challenges)
        int c1 = Math.Abs(m - d);
        int c2 = Math.Abs(d - y);
        int c3 = Math.Abs(c1 - c2);
        int c4 = Math.Abs(m - y);

        // Tuổi đạt đỉnh 1 = 36 - Số chủ đạo (Nếu 11 hay 22 thì dùng giá trị rút gọn hoặc giữ nguyên trong dải 25-36)
        int effectiveLifePath = lifePathNumber;
        if (effectiveLifePath > 11)
        {
            var (reduced, _) = PythagorasCalculator.ReduceNumber(effectiveLifePath, false);
            effectiveLifePath = reduced;
        }
        int age1 = Math.Max(25, 36 - effectiveLifePath);
        int age2 = age1 + 9;
        int age3 = age2 + 9;
        int age4 = age3 + 9;

        int birthYear = birthDate.Year;

        result.Peaks.Add(new PeakMilestone
        {
            PeakIndex = 1,
            Value = p1,
            MilestoneAge = age1,
            MilestoneYear = birthYear + age1,
            Title = $"Đỉnh cao 1 (Năm {birthYear + age1} - {age1} tuổi)",
            Description = GetPeakDescription(1, p1)
        });

        result.Peaks.Add(new PeakMilestone
        {
            PeakIndex = 2,
            Value = p2,
            MilestoneAge = age2,
            MilestoneYear = birthYear + age2,
            Title = $"Đỉnh cao 2 (Năm {birthYear + age2} - {age2} tuổi)",
            Description = GetPeakDescription(2, p2)
        });

        result.Peaks.Add(new PeakMilestone
        {
            PeakIndex = 3,
            Value = p3,
            MilestoneAge = age3,
            MilestoneYear = birthYear + age3,
            Title = $"Đỉnh cao 3 (Năm {birthYear + age3} - {age3} tuổi)",
            Description = GetPeakDescription(3, p3)
        });

        result.Peaks.Add(new PeakMilestone
        {
            PeakIndex = 4,
            Value = p4,
            MilestoneAge = age4,
            MilestoneYear = birthYear + age4,
            Title = $"Đỉnh cao 4 (Năm {birthYear + age4} - {age4} tuổi)",
            Description = GetPeakDescription(4, p4)
        });

        result.Challenges.Add(new ChallengeMilestone
        {
            ChallengeIndex = 1,
            Value = c1,
            Title = "Thử thách 1 (Giai đoạn đầu đời)",
            Description = GetChallengeDescription(1, c1)
        });

        result.Challenges.Add(new ChallengeMilestone
        {
            ChallengeIndex = 2,
            Value = c2,
            Title = "Thử thách 2 (Giai đoạn lập nghiệp)",
            Description = GetChallengeDescription(2, c2)
        });

        result.Challenges.Add(new ChallengeMilestone
        {
            ChallengeIndex = 3,
            Value = c3,
            Title = "Thử thách 3 (Thử thách cốt lõi cả đời)",
            Description = GetChallengeDescription(3, c3)
        });

        result.Challenges.Add(new ChallengeMilestone
        {
            ChallengeIndex = 4,
            Value = c4,
            Title = "Thử thách 4 (Giai đoạn viên mãn hậu vận)",
            Description = GetChallengeDescription(4, c4)
        });

        return result;
    }

    private static string GetPeakDescription(int peak, int value)
    {
        return value switch
        {
            1 => "Giai đoạn của sự khởi đầu mới, độc lập, tự chủ và xây dựng vị thế cá nhân.",
            2 => "Thời điểm của sự hòa hợp, cộng tác, cân bằng cảm xúc và kết nối đối tác bền chặt.",
            3 => "Năng lượng sáng tạo bùng nổ, mở rộng học thức, phát triển nghệ thuật và truyền cảm hứng.",
            4 => "Giai đoạn tập trung làm việc thực tế, xây dựng nền tảng vững chắc và gặt hái tài chính ổn định.",
            5 => "Mở rộng chân trời, tự do thay đổi, khám phá những cơ hội đột phá và trải nghiệm mới.",
            6 => "Đỉnh cao của tình yêu thương, chăm sóc gia đình, trách nhiệm xã hội và năng lượng chữa lành.",
            7 => "Thời kỳ chiêm nghiệm nội tâm sâu sắc, tích lũy tri thức chuyên sâu và giác ngộ tinh thần.",
            8 => "Thành công vượt bậc về sự nghiệp, uy quyền, tài chính dồi dào và năng lực điều hành đỉnh cao.",
            9 => "Giai đoạn cống hiến cho cộng đồng, hoạt động nhân đạo, chuyển giao và hoàn thành đại nghiệp.",
            10 => "Năng lượng chuyển hóa vượt bậc, sức mạnh lãnh đạo đột phá và tỏa sáng tầm vóc mới.",
            11 => "Đỉnh cao tâm linh cao cấp, trực giác siêu việt và khả năng soi đường dẫn lối cho cộng đồng.",
            22 => "Đỉnh cao bậc thầy kiến tạo (Master Builder), cơ hội thực hiện những dự án vĩ mô mang tính lịch sử.",
            _ => "Giai đoạn đón nhận năng lượng chuyển hóa tích cực."
        };
    }

    private static string GetChallengeDescription(int challenge, int value)
    {
        return value switch
        {
            0 => "Thử thách của sự lựa chọn tự do: Bạn không chịu sức ép cố định, nhưng phải tự tìm thấy mục đích và kỷ luật nội tại.",
            1 => "Thử thách về sự độc lập: Cần vượt qua sự lệ thuộc hoặc cái tôi ích kỷ, học cách tự đứng vững trên đôi chân của mình.",
            2 => "Thử thách về mối quan hệ: Dễ nhạy cảm quá mức, cần học cách thỏa hiệp, kiên nhẫn và tránh xung đột tình cảm.",
            3 => "Thử thách về biểu đạt: Khó khăn trong việc bộc lộ cảm xúc thật, dễ tự ti hoặc nói lời tiêu cực.",
            4 => "Thử thách về kỷ luật: Dễ chán nản công việc lặp lại, cần rèn luyện tính kiên nhẫn, ngăn nắp và thực tế.",
            5 => "Thử thách về tự do: Dễ buông thả theo cám dỗ nhất thời, cần học cách làm chủ đam mê và giữ gìn cam kết.",
            6 => "Thử thách về kỳ vọng gia đình: Dễ áp đặt suy nghĩ của mình lên người thân, cần học cách yêu thương vô điều kiện.",
            7 => "Thử thách về niềm tin: Dễ bi quan, hoài nghi xã hội, cần mở rộng tâm trí và học cách đón nhận tình người.",
            8 => "Thử thách về danh vọng tiền bạc: Dễ bị áp lực vật chất hoặc lạm quyền, cần giữ gìn đạo đức và sự chính trực.",
            _ => "Thử thách rèn giũa bản lĩnh và sự kiên định."
        };
    }
}
