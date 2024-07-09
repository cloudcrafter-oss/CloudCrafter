namespace CloudCrafter.Domain.Entities;

public class UserRefreshToken
{
    public required Guid Id { get; init; }
    public required string Token { get; init; }
    public required DateTime ExpiresAt { get; set; }
    public required Guid UserId { get; init; }
}
