namespace Numerology.Domain.ValueObjects;

public class ArrowItem
{
    public string Code { get; set; } = string.Empty; // "1-2-3", "4-5-6", etc.
    public string Name { get; set; } = string.Empty; // "Mũi tên Kế hoạch (1-2-3)"
    public bool IsStrength { get; set; } = true;
    public string Meaning { get; set; } = string.Empty;
}

public class BirthChartGridData
{
    // Số lần xuất hiện của các số 1..9 trong ngày sinh
    public Dictionary<int, int> BirthDateCounts { get; set; } = new();

    // Số lần xuất hiện của các số 1..9 trong tên
    public Dictionary<int, int> NameCounts { get; set; } = new();

    // Tổng hợp ngày sinh + tên
    public Dictionary<int, int> CombinedCounts { get; set; } = new();

    // Danh sách mũi tên cá tính có được (Mũi tên thế mạnh)
    public List<ArrowItem> StrengthArrows { get; set; } = new();

    // Danh sách mũi tên trống (Mũi tên thử thách/điểm yếu)
    public List<ArrowItem> WeaknessArrows { get; set; } = new();

    // Các con số bị cô lập (Isolated numbers: 1, 3, 7, 9)
    public List<int> IsolatedNumbers { get; set; } = new();
}
