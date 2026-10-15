using Numerology.Domain.Enums;

namespace Numerology.Domain.Entities;

public class LookupReport
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? UserId { get; set; }
    public UserAccount? User { get; set; }

    public string FullName { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public string? BirthTime { get; set; }
    public string? Gender { get; set; } // Nam, Nữ, Khác
    public ServiceTypeEnum ServiceType { get; set; } = ServiceTypeEnum.Numerology;
    public string ShareToken { get; set; } = string.Empty;
    public string MetricsJson { get; set; } = string.Empty; // Serialized NumerologyMetrics or Quiz result
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
