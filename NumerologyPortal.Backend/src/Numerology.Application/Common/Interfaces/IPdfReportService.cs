using Numerology.Domain.ValueObjects;

namespace Numerology.Application.Common.Interfaces;

public interface IPdfReportService
{
    byte[] GenerateReportPdf(string fullName, DateTime birthDate, NumerologyMetrics metrics);
}
