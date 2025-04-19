using Ardalis.SharedKernel;
using Microsoft.AspNetCore.Identity;

namespace CloudCrafter.Domain.Entities;

public class User : IdentityUser<Guid>, IAggregateRoot
{
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public List<UserRefreshToken> RefreshTokens { get; set; } = new();

    public List<TeamUser> TeamUsers { get; set; } = new();

    public string FullName { get; set; } = string.Empty;
}
