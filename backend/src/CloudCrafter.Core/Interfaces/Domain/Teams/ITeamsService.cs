using CloudCrafter.Domain.Domain.Teams;

namespace CloudCrafter.Core.Interfaces.Domain.Teams;

public interface ITeamsService
{
    Task<Guid> CreateTeam(string name, Guid ownerId);
    Task DeleteTeam(Guid teamId);
    Task UpdateTeamName(Guid teamId, string name);
    Task<List<SimpleTeamDto>> GetTeams(Guid userId);
}
