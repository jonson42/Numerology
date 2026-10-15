using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace Numerology.Application.Services.NumerologyEngine;

public class VowelConsonantResult
{
    public string NormalizedFullName { get; set; } = string.Empty;
    public List<char> Vowels { get; set; } = new();
    public List<char> Consonants { get; set; } = new();
    public List<char> AllLetters { get; set; } = new();
}

public static class VietnameseNameNormalizer
{
    private static readonly HashSet<char> StandardVowels = new() { 'A', 'E', 'I', 'O', 'U' };

    /// <summary>
    /// Xóa dấu tiếng Việt, chuyển thành chữ in hoa A-Z không dấu chuẩn
    /// </summary>
    public static string RemoveDiacritics(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return string.Empty;

        // Xử lý ký tự Đ / đ đặc biệt của tiếng Việt
        text = text.Replace("Đ", "D").Replace("đ", "d");

        string normalizedString = text.Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder();

        foreach (char c in normalizedString)
        {
            var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        string cleanText = stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        // Giữ lại ký tự alphabet và khoảng trắng
        cleanText = Regex.Replace(cleanText, @"[^a-zA-Z\s]", " ");
        cleanText = Regex.Replace(cleanText, @"\s+", " ").Trim().ToUpperInvariant();

        return cleanText;
    }

    /// <summary>
    /// Phân tích danh từ riêng tiếng Việt thành danh sách Nguyên âm & Phụ âm chuẩn Pythagoras
    /// Xử lý chữ Y: Trong MY, LY, VY, THY, YÊN... Y được tính là Nguyên âm.
    /// Nếu có nguyên âm chính đứng kèm như NGUYEN (chữ E là nguyên âm chính), Y đóng vai trò bán âm/phụ âm.
    /// </summary>
    public static VowelConsonantResult AnalyzeLetters(string fullName)
    {
        string normalized = RemoveDiacritics(fullName);
        var result = new VowelConsonantResult
        {
            NormalizedFullName = normalized
        };

        if (string.IsNullOrWhiteSpace(normalized))
            return result;

        string[] words = normalized.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        foreach (var word in words)
        {
            // Kiểm tra xem từ có nguyên âm chuẩn A, E, I, O, U nào không
            bool hasStandardVowel = word.Any(c => StandardVowels.Contains(c));

            for (int i = 0; i < word.Length; i++)
            {
                char c = word[i];
                result.AllLetters.Add(c);

                if (StandardVowels.Contains(c))
                {
                    result.Vowels.Add(c);
                }
                else if (c == 'Y')
                {
                    // Nếu từ KHÔNG có nguyên âm nào khác (VD: MY, LY, VY, THY, KỲ, Ý...) -> Y chắc chắn là NGUYÊN ÂM
                    if (!hasStandardVowel)
                    {
                        result.Vowels.Add(c);
                    }
                    else
                    {
                        // Nếu từ có nguyên âm khác:
                        // Xét vị trí của Y:
                        // Ví dụ "YEN": Y đứng đầu và sau là E (nguyên âm) -> Y đóng vai trò bán phụ âm
                        // "NGUYEN": E là nguyên âm chính, U là âm đệm, Y là phụ âm
                        // "THUY", "DUY": U là nguyên âm, Y là bán âm -> theo thần số học thường quy Y là nguyên âm nếu âm cuối tạo vần
                        bool isPrevVowel = i > 0 && StandardVowels.Contains(word[i - 1]);
                        bool isNextVowel = i < word.Length - 1 && StandardVowels.Contains(word[i + 1]);

                        if (isPrevVowel && isNextVowel)
                        {
                            // Kẹp giữa 2 nguyên âm (VD: MAYA) -> Phụ âm
                            result.Consonants.Add(c);
                        }
                        else if (!isPrevVowel && isNextVowel)
                        {
                            // Đứng trước nguyên âm (VD: YEN) -> Phụ âm
                            result.Consonants.Add(c);
                        }
                        else if (isPrevVowel && !isNextVowel)
                        {
                            // Đứng sau nguyên âm và cuối từ (VD: DUY, HUY, THUY): U và Y
                            // Trong thần số học Việt Nam, U và Y cùng góp phần tạo âm linh hồn
                            result.Vowels.Add(c);
                        }
                        else
                        {
                            result.Consonants.Add(c);
                        }
                    }
                }
                else
                {
                    result.Consonants.Add(c);
                }
            }
        }

        return result;
    }
}
