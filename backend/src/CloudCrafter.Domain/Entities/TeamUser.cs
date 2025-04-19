namespace CloudCrafter.Domain.Entities;

public class TeamUser
{
    public required Guid UserId { get; init; }
    public required Guid TeamId { get; init; }
    public virtual User User { get; set; } = null!;
    public virtual Team Team { get; set; } = null!;
}
