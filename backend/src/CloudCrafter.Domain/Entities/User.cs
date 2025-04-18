using Ardalis.SharedKernel;
using Microsoft.AspNetCore.Identity;

namespace CloudCrafter.Domain.Entities;

public class User : IdentityUser<Guid>, IAggregateRoot
{
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public List<UserRefreshToken> RefreshTokens { get; set; } = new List<UserRefreshToken>();

    public List<Team> Teams { get; set; } = new List<Team>();

    public string FullName { get; set; } = string.Empty;
}
