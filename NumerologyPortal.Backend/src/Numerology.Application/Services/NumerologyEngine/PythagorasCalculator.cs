using Numerology.Domain.ValueObjects;

namespace Numerology.Application.Services.NumerologyEngine;

public class PythagorasCalculator
{
    private static readonly Dictionary<char, int> LetterToNumberMap = new()
    {
        { 'A', 1 }, { 'J', 1 }, { 'S', 1 },
        { 'B', 2 }, { 'K', 2 }, { 'T', 2 },
        { 'C', 3 }, { 'L', 3 }, { 'U', 3 },
        { 'D', 4 }, { 'M', 4 }, { 'V', 4 },
        { 'E', 5 }, { 'N', 5 }, { 'W', 5 },
        { 'F', 6 }, { 'O', 6 }, { 'X', 6 },
        { 'G', 7 }, { 'P', 7 }, { 'Y', 7 },
        { 'H', 8 }, { 'Q', 8 }, { 'Z', 8 },
        { 'I', 9 }, { 'R', 9 }
    };

    public static int GetLetterValue(char c)
    {
        char upper = char.ToUpperInvariant(c);
        return LetterToNumberMap.TryGetValue(upper, out int val) ? val : 0;
    }

    /// <summary>
    /// Rút gọn tổng các chữ số về 1 chữ số, giữ lại số Master (11, 22, 33) nếu allowMaster = true.
    /// Ghi nhận nếu xuất hiện Nợ nghiệp (13, 14, 16, 19).
    /// </summary>
    public static (int Result, List<string> KarmicDebts) ReduceNumber(int number, bool allowMaster = true)
    {
        var karmicDebts = new List<string>();

        while (number > 9)
        {
            if (number == 13 && !karmicDebts.Contains("13/4")) karmicDebts.Add("13/4");
            if (number == 14 && !karmicDebts.Contains("14/5")) karmicDebts.Add("14/5");
            if (number == 16 && !karmicDebts.Contains("16/7")) karmicDebts.Add("16/7");
            if (number == 19 && !karmicDebts.Contains("19/1")) karmicDebts.Add("19/1");

            if (allowMaster && (number == 11 || number == 22 || number == 33))
            {
                break;
            }

            int sum = 0;
            int temp = number;
            while (temp > 0)
            {
                sum += temp % 10;
                temp /= 10;
            }
            number = sum;
        }

        return (number, karmicDebts);
    }

    /// <summary>
    /// Tính Số Chủ Đạo (Life Path Number) chuẩn theo ngày tháng năm sinh
    /// </summary>
    public static (int LifePath, List<string> Debts) CalculateLifePath(DateTime birthDate)
    {
        var allDebts = new List<string>();

        var (dayReduced, dayDebts) = ReduceNumber(birthDate.Day, allowMaster: true);
        var (monthReduced, monthDebts) = ReduceNumber(birthDate.Month, allowMaster: false);
        var (yearReduced, yearDebts) = ReduceNumber(birthDate.Year, allowMaster: true);

        allDebts.AddRange(dayDebts);
        allDebts.AddRange(monthDebts);
        allDebts.AddRange(yearDebts);

        int total = dayReduced + monthReduced + yearReduced;
        var (finalLifePath, totalDebts) = ReduceNumber(total, allowMaster: true);
        allDebts.AddRange(totalDebts);

        return (finalLifePath, allDebts.Distinct().ToList());
    }

    /// <summary>
    /// Tính Chỉ số Sứ Mệnh (Destiny Number) từ toàn bộ chữ cái trong tên
    /// </summary>
    public static (int Destiny, List<string> Debts) CalculateDestiny(IEnumerable<char> allLetters)
    {
        int sum = allLetters.Sum(GetLetterValue);
        return ReduceNumber(sum, allowMaster: true);
    }

    /// <summary>
    /// Tính Chỉ số Linh Hồn (Soul Urge Number) từ các nguyên âm
    /// </summary>
    public static (int SoulUrge, List<string> Debts) CalculateSoulUrge(IEnumerable<char> vowels)
    {
        int sum = vowels.Sum(GetLetterValue);
        return ReduceNumber(sum, allowMaster: true);
    }

    /// <summary>
    /// Tính Chỉ số Nhân Cách (Personality Number) từ các phụ âm
    /// </summary>
    public static (int Personality, List<string> Debts) CalculatePersonality(IEnumerable<char> consonants)
    {
        int sum = consonants.Sum(GetLetterValue);
        return ReduceNumber(sum, allowMaster: true);
    }

    /// <summary>
    /// Tính Chỉ số Ngày Sinh (Birthday Number)
    /// </summary>
    public static (int Birthday, List<string> Debts) CalculateBirthday(int day)
    {
        return ReduceNumber(day, allowMaster: true);
    }

    /// <summary>
    /// Tính Chỉ số Thái Độ (Attitude Number) = Ngày + Tháng
    /// </summary>
    public static int CalculateAttitude(int day, int month)
    {
        var (d, _) = ReduceNumber(day, false);
        var (m, _) = ReduceNumber(month, false);
        var (res, _) = ReduceNumber(d + m, false);
        return res;
    }

    /// <summary>
    /// Tính Chỉ số Trưởng Thành (Maturity Number) = Số Chủ Đạo + Sứ Mệnh
    /// </summary>
    public static int CalculateMaturity(int lifePath, int destiny)
    {
        var (res, _) = ReduceNumber(lifePath + destiny, allowMaster: true);
        return res;
    }

    /// <summary>
    /// Tính Chỉ số Cân Bằng (Balance Number) = Tổng các chữ cái đầu tiên trong mỗi từ của tên
    /// </summary>
    public static int CalculateBalance(string fullName)
    {
        string normalized = VietnameseNameNormalizer.RemoveDiacritics(fullName);
        string[] words = normalized.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        int sum = 0;
        foreach (var word in words)
        {
            if (word.Length > 0)
            {
                sum += GetLetterValue(word[0]);
            }
        }
        var (res, _) = ReduceNumber(sum, false);
        return res;
    }

    /// <summary>
    /// Tính Chỉ số Tư Duy Lý Trí = Ngày sinh (rút gọn) + Tên gọi chính (First Name) rút gọn
    /// </summary>
    public static int CalculateRationalThought(int day, string fullName)
    {
        string normalized = VietnameseNameNormalizer.RemoveDiacritics(fullName);
        string[] words = normalized.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        string firstName = words.Length > 0 ? words[^1] : ""; // Tên chính ở cuối trong tiếng Việt (VD: Nguyễn Văn AN -> AN)
        int firstNameSum = firstName.Sum(GetLetterValue);

        var (d, _) = ReduceNumber(day, false);
        var (fn, _) = ReduceNumber(firstNameSum, false);
        var (res, _) = ReduceNumber(d + fn, false);
        return res;
    }

    /// <summary>
    /// Tính các con số Đam Mê và Bài Học Nghiệp (Số Thiếu) từ các chữ cái trong tên
    /// </summary>
    public static (List<int> PassionNumbers, List<int> KarmicLessons, int SubconsciousSelf) CalculatePassionAndLessons(IEnumerable<char> allLetters)
    {
        var frequencies = new Dictionary<int, int>();
        for (int i = 1; i <= 9; i++) frequencies[i] = 0;

        foreach (var c in allLetters)
        {
            int val = GetLetterValue(c);
            if (val >= 1 && val <= 9)
            {
                frequencies[val]++;
            }
        }

        // Bài học nghiệp = các số xuất hiện 0 lần
        var karmicLessons = frequencies.Where(kv => kv.Value == 0).Select(kv => kv.Key).OrderBy(k => k).ToList();

        // Đam mê = các số có tần số xuất hiện cao nhất (> 1 và max)
        int maxCount = frequencies.Values.Max();
        var passionNumbers = new List<int>();
        if (maxCount > 1)
        {
            passionNumbers = frequencies.Where(kv => kv.Value == maxCount).Select(kv => kv.Key).OrderBy(k => k).ToList();
        }

        // Sức mạnh tiềm thức = 9 - số lượng bài học nghiệp
        int subconsciousSelf = 9 - karmicLessons.Count;

        return (passionNumbers, karmicLessons, subconsciousSelf);
    }

    /// <summary>
    /// Tính Năm Cá Nhân = Ngày + Tháng + Năm hiện tại (Rút gọn về 1..9)
    /// </summary>
    public static int CalculatePersonalYear(int day, int month, int targetYear)
    {
        var (d, _) = ReduceNumber(day, false);
        var (m, _) = ReduceNumber(month, false);
        var (y, _) = ReduceNumber(targetYear, false);
        var (res, _) = ReduceNumber(d + m + y, false);
        return res;
    }

    /// <summary>
    /// Tính Tháng Cá Nhân = Năm Cá Nhân + Tháng hiện tại (Rút gọn về 1..9)
    /// </summary>
    public static int CalculatePersonalMonth(int personalYear, int targetMonth)
    {
        var (m, _) = ReduceNumber(targetMonth, false);
        var (res, _) = ReduceNumber(personalYear + m, false);
        return res;
    }
}
