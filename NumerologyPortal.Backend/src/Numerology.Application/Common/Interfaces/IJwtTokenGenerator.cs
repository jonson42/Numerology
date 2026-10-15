using Numerology.Domain.Entities;

namespace Numerology.Application.Common.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(UserAccount user);
}
