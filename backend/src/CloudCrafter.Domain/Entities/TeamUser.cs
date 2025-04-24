using CloudCrafter.Domain.Entities.Interfaces;

namespace CloudCrafter.Domain.Entities;

public class TeamUser : IHaveATeam
{
    public required Guid UserId { get; init; }
    public required Guid TeamId { get; set; }
    public virtual User User { get; set; } = null!;
    public virtual Team Team { get; set; } = null!;
}
