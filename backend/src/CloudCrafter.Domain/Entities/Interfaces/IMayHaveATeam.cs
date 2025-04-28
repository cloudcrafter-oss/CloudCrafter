namespace CloudCrafter.Domain.Entities.Interfaces;

public interface IMayHaveATeam
{
    Guid? TeamId { get; set; }
    Team? Team { get; set; }
}
