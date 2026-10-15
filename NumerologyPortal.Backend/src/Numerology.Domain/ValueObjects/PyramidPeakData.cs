namespace Numerology.Domain.ValueObjects;

public class PeakMilestone
{
    public int PeakIndex { get; set; } // 1, 2, 3, 4
    public int Value { get; set; } // Con số đỉnh cao (có thể là 1..9, 10, 11, 22)
    public int MilestoneAge { get; set; } // Độ tuổi đạt đỉnh cao
    public int MilestoneYear { get; set; } // Năm dương lịch đạt đỉnh cao
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class ChallengeMilestone
{
    public int ChallengeIndex { get; set; } // 1, 2, 3, 4
    public int Value { get; set; } // Con số thử thách (0..8)
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class PyramidPeakData
{
    public List<PeakMilestone> Peaks { get; set; } = new();
    public List<ChallengeMilestone> Challenges { get; set; } = new();
}
