using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface ITeamsRepository
{
    Task<Guid> CreateTeam(string name, Guid ownerId);
    Task DeleteTeam(Guid teamId);
    Task UpdateTeamName(Guid teamId, string name);
    Task<List<Team>> GetTeamsForUser(Guid userId);
    Task<List<Team>> GetAllTeams();
    Task<List<Team>> GetTeamsWithProjectsAndEnvironments(Guid userId);
    Task<Team> GetTeam(Guid teamId);
}
