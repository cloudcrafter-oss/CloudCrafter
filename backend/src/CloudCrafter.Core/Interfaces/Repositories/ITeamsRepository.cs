using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Domain.Common.Pagination;
using CloudCrafter.Domain.Domain.Teams;
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
    Task AddUserToTeam(Team team, User user);
    Task RemoveUserFromTeam(Team team, User user);
    Task<PaginatedList<TeamMemberDto>> GetTeamMembers(Guid teamId, PaginatedRequest pagination);
}
