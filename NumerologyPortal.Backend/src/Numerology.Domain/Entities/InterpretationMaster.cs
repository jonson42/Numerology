using Numerology.Domain.Enums;

namespace Numerology.Domain.Entities;

public class InterpretationMaster
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public ServiceTypeEnum ServiceType { get; set; } = ServiceTypeEnum.Numerology;
    public string IndicatorCode { get; set; } = string.Empty; // LIFE_PATH, DESTINY, SOUL, PERSONALITY, BIRTHDAY, ATTITUDE, MATURITY, KARMIC_DEBT, PYRAMID_PEAK, PYRAMID_CHALLENGE, PERSONAL_YEAR, DISC_D, DISC_I, MBTI_INTJ, etc.
    public string IndicatorName { get; set; } = string.Empty; // Tên hiển thị tiếng Việt, ví dụ: "Chỉ số Đường đời", "Chỉ số Sứ mệnh"
    public string NumberKey { get; set; } = string.Empty; // "1", "2", ... "11", "22", "33", "13/4", "INTJ", "D"
    public string Title { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string ContentHtml { get; set; } = string.Empty;
    public bool IsVipOnly { get; set; } = false;
    public int SortOrder { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
