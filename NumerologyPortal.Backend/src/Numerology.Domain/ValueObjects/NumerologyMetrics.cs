namespace Numerology.Domain.ValueObjects;

public class PersonalCycleYear
{
    public int Year { get; set; }
    public int PersonalYearNumber { get; set; } // 1..9
    public string Phase { get; set; } = string.Empty; // Giai đoạn gieo hạt, đỉnh cao, lắng đọng, chuyển giao...
    public string Description { get; set; } = string.Empty;
    public bool IsCurrentYear { get; set; }
}

public class IndicatorResult
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty; // Chuỗi hiển thị (ví dụ "11", "22/4", "13/4")
    public int NumericValue { get; set; }
    public string Category { get; set; } = string.Empty; // Cốt lõi, Tính cách, Vận hạn, Nợ nghiệp...
    public bool IsVipOnly { get; set; }
    public string Summary { get; set; } = string.Empty;
    public string ContentHtml { get; set; } = string.Empty;
    public bool IsLocked { get; set; } // Paywall state for response
}

public class NumerologyMetrics
{
    // Các chỉ số cốt lõi (Core)
    public int LifePathNumber { get; set; } // Số Chủ Đạo (2..11, 22, 33)
    public int DestinyNumber { get; set; } // Chỉ số Sứ Mệnh (1..9, 11, 22, 33)
    public int SoulUrgeNumber { get; set; } // Chỉ số Linh Hồn (1..9, 11, 22)
    public int PersonalityNumber { get; set; } // Chỉ số Nhân Cách (1..9, 11, 22)
    public int BirthdayNumber { get; set; } // Chỉ số Ngày Sinh (1..11, 22)
    public int AttitudeNumber { get; set; } // Chỉ số Thái Độ (1..9)

    // Các chỉ số bổ trợ & phát triển
    public int MaturityNumber { get; set; } // Chỉ số Trưởng Thành (1..9, 11, 22)
    public int BalanceNumber { get; set; } // Chỉ số Cân Bằng (1..9)
    public int RationalThoughtNumber { get; set; } // Chỉ số Tư Duy Lý Trí (1..9)
    public int SubconsciousSelfNumber { get; set; } // Sức Mạnh Tiềm Thức (1..9)

    // Nợ nghiệp & Bài học nghiệp
    public List<int> PassionNumbers { get; set; } = new(); // Chỉ số Đam Mê (1..9)
    public List<int> KarmicLessonNumbers { get; set; } = new(); // Bài học nghiệp / Chỉ số thiếu (1..9)
    public List<string> KarmicDebtNumbers { get; set; } = new(); // Nợ nghiệp: "13/4", "14/5", "16/7", "19/1"

    // Vận niên
    public int PersonalYearNumber { get; set; } // Năm cá nhân
    public int PersonalMonthNumber { get; set; } // Tháng cá nhân
    public int PersonalDayNumber { get; set; } // Ngày cá nhân

    // 3 Biểu đồ trực quan
    public BirthChartGridData BirthChartGrid { get; set; } = new();
    public PyramidPeakData PyramidPeaks { get; set; } = new();
    public List<PersonalCycleYear> LifeCycleWave { get; set; } = new();

    // Toàn bộ danh mục 26+ chỉ số chi tiết
    public List<IndicatorResult> DetailedIndicators { get; set; } = new();
}
