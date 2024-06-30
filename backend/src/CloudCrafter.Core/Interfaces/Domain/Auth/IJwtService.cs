using System.Security.Claims;
using CloudCrafter.Domain.Domain.Auth;

namespace CloudCrafter.Core.Interfaces.Domain.Auth;

public interface IJwtService
{
    TokenDto GenerateForClaims(List<Claim> authClaims);
}
