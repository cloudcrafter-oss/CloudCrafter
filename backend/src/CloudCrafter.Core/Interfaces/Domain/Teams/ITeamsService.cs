namespace CloudCrafter.Core.Interfaces.Domain.Teams;

public interface ITeamsService
{
    Task<Guid> CreateTeam(string name);
    Task DeleteTeam(Guid teamId);
    Task UpdateTeamName(Guid teamId, string name);
}
