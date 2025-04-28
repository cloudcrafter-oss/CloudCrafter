namespace CloudCrafter.Domain.Entities.Interfaces;

public interface IHaveATeam
{
    Guid TeamId { get; set; }
    Team Team { get; set; }
}
