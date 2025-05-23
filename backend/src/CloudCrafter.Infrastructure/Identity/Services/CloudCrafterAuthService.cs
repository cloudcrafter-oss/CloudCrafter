using Ardalis.GuardClauses;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Auth;
using CloudCrafter.Domain.Domain.Auth;
using CloudCrafter.Domain.Domain.User;
using CloudCrafter.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace CloudCrafter.Infrastructure.Identity.Services;

public class CloudCrafterAuthService(
    UserManager<User> userManager,
    IJwtService jwtService,
    IIdentityService identityService
) : ICloudCrafterAuthService
{
    public async Task<TokenDto> LoginAsync(string email, string password)
    {
        var user = await userManager.FindByEmailAsync(email);

        if (user == null || !await userManager.CheckPasswordAsync(user, password))
        {
            throw new UnauthorizedAccessException();
        }

        return await CreateTokenForUserAsync(user);
    }

    public async Task<TokenDto> CreateUserAsync(string email, string name)
    {
        var user = await userManager.FindByEmailAsync(email);

        if (user != null)
        {
            return await CreateTokenForUserAsync(user);
        }

        var result = await identityService.CreateUserWithoutPassword(email, name);

        if (!result.Result.IsSuccess)
        {
            throw new UnauthorizedAccessException();
        }

        var userFromManager = await userManager.FindByEmailAsync(email);

        if (userFromManager == null)
        {
            throw new UnauthorizedAccessException();
        }

        return await CreateTokenForUserAsync(userFromManager);
    }

    public async Task<Guid> CreateUserWithPasswordAsync(string email, string name, string password)
    {
        var user = await userManager.FindByEmailAsync(email);

        if (user != null)
        {
            return user.Id;
        }

        var result = await identityService.CreateUserAsync(email, password);

        if (!result.Result.IsSuccess)
        {
            throw new UnauthorizedAccessException();
        }

        return result.UserId;
    }

    public async Task<TokenDto> FetchTokensForRefreshToken(string refreshToken)
    {
        var userId = await jwtService.GetUserIdFromRefreshToken(refreshToken);

        if (userId == null)
        {
            throw new UnauthorizedAccessException();
        }

        var user = await userManager.FindByIdAsync(userId.Value.ToString());

        if (user == null)
        {
            throw new UnauthorizedAccessException();
        }

        return await CreateTokenForUserAsync(user, refreshToken);
    }

    public async Task<List<RoleDto>> GetRoles(Guid userId)
    {
        var user = await userManager.FindByIdAsync(userId.ToString());

        if (user == null)
        {
            throw new NotFoundException("User", "User not found");
        }

        var roles = await userManager.GetRolesAsync(user);

        var roleDtoList = new List<RoleDto>();

        foreach (var role in roles)
        {
            var roleDto = new RoleDto { Name = role };
            roleDtoList.Add(roleDto);
        }

        return roleDtoList;
    }

    private async Task<TokenDto> CreateTokenForUserAsync(
        User user,
        string? refreshTokenToDisable = null
    )
    {
        var roles = await userManager.GetRolesAsync(user);

        var result = await jwtService.GenerateTokenForUserAsync(user, roles.ToList());

        // If refreshtoken is provided, we should disable it
        if (refreshTokenToDisable != null)
        {
            await jwtService.DisableRefreshToken(refreshTokenToDisable);
        }

        return result;
    }
}
