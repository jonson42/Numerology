using Numerology.Domain.ValueObjects;

namespace Numerology.Application.Services.NumerologyEngine;

public class BirthGridCalculator
{
    public static BirthChartGridData CalculateGrid(DateTime birthDate, IEnumerable<char> nameLetters)
    {
        var data = new BirthChartGridData();

        for (int i = 1; i <= 9; i++)
        {
            data.BirthDateCounts[i] = 0;
            data.NameCounts[i] = 0;
            data.CombinedCounts[i] = 0;
        }

        // Đếm ngày sinh (Ngày, Tháng, Năm)
        string dateDigits = $"{birthDate.Day:00}{birthDate.Month:00}{birthDate.Year:0000}";
        foreach (char d in dateDigits)
        {
            if (char.IsDigit(d))
            {
                int val = d - '0';
                if (val >= 1 && val <= 9)
                {
                    data.BirthDateCounts[val]++;
                    data.CombinedCounts[val]++;
                }
            }
        }

        // Đếm tên
        foreach (char c in nameLetters)
        {
            int val = PythagorasCalculator.GetLetterValue(c);
            if (val >= 1 && val <= 9)
            {
                data.NameCounts[val]++;
                data.CombinedCounts[val]++;
            }
        }

        // Xác định mũi tên thế mạnh & mũi tên trống dựa trên biểu đồ ngày sinh (chuẩn David Phillips)
        var counts = data.BirthDateCounts;

        CheckArrow(data, counts, 1, 2, 3, "1-2-3", "Mũi tên Kế hoạch", "Người có khả năng tổ chức, lên kế hoạch chi tiết, ngăn nắp và trình tự rõ ràng.", "Mũi tên Hỗn loạn", "Dễ rơi vào thế bị động, thiếu sự sắp xếp ngăn nắp, làm việc theo cảm tính.");
        CheckArrow(data, counts, 4, 5, 6, "4-5-6", "Mũi tên Ý chí", "Có nghị lực phi thường, kiên trì theo đuổi mục tiêu và không dễ lùi bước.", "Mũi tên Uất giận", "Dễ cảm thấy bất mãn, kỳ vọng quá nhiều rồi thất vọng sâu sắc.");
        CheckArrow(data, counts, 7, 8, 9, "7-8-9", "Mũi tên Hoạt động", "Nhanh nhẹn, năng động, thích trải nghiệm thực tế và du lịch khám phá.", "Mũi tên Thụ động", "Hay chần chừ, ngại thay đổi vùng an toàn, thiếu tính chủ động.");
        CheckArrow(data, counts, 1, 4, 7, "1-4-7", "Mũi tên Thực tế", "Thực tế, khéo tay, giỏi kỹ thuật, trân trọng giá trị vật chất và cụ thể.", "Mũi tên Mộng mơ", "Thiếu tính thực tiễn, dễ mơ mộng viển vông, khó biến ý tưởng thành hành động.");
        CheckArrow(data, counts, 2, 5, 8, "2-5-8", "Mũi tên Cảm xúc & Nhạy bén", "Cân bằng cảm xúc tốt, có trực giác tâm linh phong phú và thấu hiểu người khác.", "Mũi tên Dễ tổn thương", "Tâm lý nhạy cảm, dễ bị tổn thương bởi lời nói của người khác, sống khép kín.");
        CheckArrow(data, counts, 3, 6, 9, "3-6-9", "Mũi tên Sáng suốt & Trí tuệ", "Trí nhớ siêu phàm, tư duy sắc sảo, đầu óc sáng tạo và ham học hỏi.", "Mũi tên Kém trí nhớ", "Hay đãng trí, khó tập trung lâu dài vào việc ghi nhớ dữ liệu chi tiết.");
        CheckArrow(data, counts, 1, 5, 9, "1-5-9", "Mũi tên Quyết tâm", "Tính cách kiên định, đã quyết là làm tới cùng, không bao giờ bỏ cuộc nửa chừng.", "Mũi tên Trì hoãn", "Thiếu sự kiên định, dễ nản lòng khi gặp chướng ngại vật đầu tiên.");
        CheckArrow(data, counts, 3, 5, 7, "3-5-7", "Mũi tên Tâm linh & Trực giác", "Có chiều sâu tinh thần, nhân ái, lòng trắc ẩn và cảm nhận tâm linh sâu sắc.", "Mũi tên Hoài nghi", "Hay đa nghi, chỉ tin những gì thấy tận mắt, cần chứng cứ rõ ràng.");

        // Xác định các con số bị cô lập (Isolated Numbers)
        // 1 cô lập: nếu 1 > 0 và 2, 4, 5 đều = 0
        if (counts[1] > 0 && counts[2] == 0 && counts[4] == 0 && counts[5] == 0)
        {
            data.IsolatedNumbers.Add(1);
        }
        // 3 cô lập: nếu 3 > 0 và 2, 5, 6 đều = 0
        if (counts[3] > 0 && counts[2] == 0 && counts[5] == 0 && counts[6] == 0)
        {
            data.IsolatedNumbers.Add(3);
        }
        // 7 cô lập: nếu 7 > 0 và 4, 5, 8 đều = 0
        if (counts[7] > 0 && counts[4] == 0 && counts[5] == 0 && counts[8] == 0)
        {
            data.IsolatedNumbers.Add(7);
        }
        // 9 cô lập: nếu 9 > 0 và 5, 6, 8 đều = 0
        if (counts[9] > 0 && counts[5] == 0 && counts[6] == 0 && counts[8] == 0)
        {
            data.IsolatedNumbers.Add(9);
        }

        return data;
    }

    private static void CheckArrow(
        BirthChartGridData data,
        Dictionary<int, int> counts,
        int n1, int n2, int n3,
        string code,
        string strengthTitle, string strengthDesc,
        string weaknessTitle, string weaknessDesc)
    {
        bool hasAll = counts[n1] > 0 && counts[n2] > 0 && counts[n3] > 0;
        bool hasNone = counts[n1] == 0 && counts[n2] == 0 && counts[n3] == 0;

        if (hasAll)
        {
            data.StrengthArrows.Add(new ArrowItem
            {
                Code = code,
                Name = strengthTitle,
                IsStrength = true,
                Meaning = strengthDesc
            });
        }
        else if (hasNone)
        {
            data.WeaknessArrows.Add(new ArrowItem
            {
                Code = $"Empty-{code}",
                Name = weaknessTitle,
                IsStrength = false,
                Meaning = weaknessDesc
            });
        }
    }
}
