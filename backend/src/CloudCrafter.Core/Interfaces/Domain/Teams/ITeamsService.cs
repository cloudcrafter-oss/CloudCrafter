using CloudCrafter.Domain.Domain.Teams;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Interfaces.Domain.Teams;

public interface ITeamsService
{
    Task<Guid> CreateTeam(string name, Guid ownerId);
    Task DeleteTeam(Guid teamId);
    Task UpdateTeamName(Guid teamId, string name);
    Task<Team> GetTeam(Guid teamId);
    Task<List<SimpleTeamDto>> GetTeams(Guid userId);
    Task<List<SimpleTeamDto>> GetAllTeams();
    Task<List<SimpleTeamWithProjectsAndEnvironmentsDto>> GetTeamsWithProjectsAndEnvironments(
        Guid userId
    );
}
