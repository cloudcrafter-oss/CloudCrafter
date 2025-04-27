using Ardalis.GuardClauses;
using AutoMapper;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Common.Responses;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Common.Pagination;
using CloudCrafter.Domain.Domain.Teams;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Common.Helpers;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Infrastructure.Repositories;

public class TeamsRepository(IApplicationDbContext context, IMapper mapper) : ITeamsRepository
{
    public async Task<Guid> CreateTeam(string name, Guid ownerId)
    {
        var team = new Team
        {
            Id = Guid.NewGuid(),
            Name = name,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            OwnerId = ownerId,
        };

        context.Teams.Add(team);
        await context.SaveChangesAsync();
        return team.Id;
    }

    public async Task DeleteTeam(Guid teamId)
    {
        var team = await context.Teams.FindAsync(teamId);
        if (team == null)
        {
            throw new NotFoundException("Team", "Team not found");
        }

        context.Teams.Remove(team);
        await context.SaveChangesAsync();
    }

    public async Task UpdateTeamName(Guid teamId, string name)
    {
        var team = await context.Teams.FindAsync(teamId);
        if (team == null)
        {
            throw new NotFoundException("Team", "Team not found");
        }

        team.Name = name;
        await context.SaveChangesAsync();
    }

    public Task<List<Team>> GetTeamsForUser(Guid userId)
    {
        var teams = UserTeams(userId).ToListAsync();

        return teams;
    }

    public Task<List<Team>> GetAllTeams()
    {
        return context.Teams.OrderBy(x => x.CreatedAt).ToListAsync();
    }

    public Task<List<Team>> GetTeamsWithProjectsAndEnvironments(Guid userId)
    {
        var teams = UserTeams(userId)
            .Include(team => team.Projects)
            .ThenInclude(project => project.Environments);

        return teams.ToListAsync();
    }

    public async Task<Team> GetTeam(Guid teamId)
    {
        var team = await context
            .Teams.Include(x => x.TeamUsers)
            .Where(x => x.Id == teamId)
            .FirstOrDefaultAsync();

        if (team == null)
        {
            throw new NotFoundException("Team", "Team not found");
        }

        return team;
    }

    public async Task AddUserToTeam(Team team, User user)
    {
        context.TeamUsers.Add(new TeamUser() { TeamId = team.Id, UserId = user.Id });

        await context.SaveChangesAsync();
    }

    public async Task<PaginatedList<TeamMemberDto>> GetTeamMembers(
        Guid teamId,
        PaginatedRequest pagination
    )
    {
        var users = context
            .TeamUsers.Where(x => x.TeamId == teamId)
            .Include(x => x.User)
            .AsQueryable();

        var result = await users.ToPaginatedListAsync<TeamUser, TeamMemberDto>(pagination, mapper);

        return result;
    }

    private IQueryable<Team> UserTeams(Guid userId)
    {
        return context.Teams.Where(x =>
            x.TeamUsers.Any(y => y.UserId == userId) || x.OwnerId == userId
        );
    }
}
