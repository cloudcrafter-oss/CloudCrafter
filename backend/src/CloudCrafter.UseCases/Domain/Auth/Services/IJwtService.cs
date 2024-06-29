using System.Security.Claims;
using CloudCrafter.Core.Domain.Auth;

namespace CloudCrafter.UseCases.Domain.Auth.Services;

public interface IJwtService
{
    TokenDto GenerateForClaims(List<Claim> authClaims);
}
