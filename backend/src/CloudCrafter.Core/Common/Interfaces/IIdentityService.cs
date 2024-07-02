using Ardalis.Result;

namespace CloudCrafter.Core.Common.Interfaces;

public interface IIdentityService
{
    Task<string?> GetUserNameAsync(Guid userId);

    Task<bool> IsInRoleAsync(Guid userId, string role);

    Task<bool> AuthorizeAsync(Guid userId, string policyName);

    Task<(Result Result, Guid UserId)> CreateUserAsync(string userName, string password);

    Task<(Result Result, Guid UserId)> CreateUserWithoutPassword(string email, string name);

    Task<Result> DeleteUserAsync(Guid userId);
}
