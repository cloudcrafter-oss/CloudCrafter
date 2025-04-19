using Ardalis.GuardClauses;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Infrastructure.Repositories;

public class TeamsRepository(IApplicationDbContext context) : ITeamsRepository
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

    private IQueryable<Team> UserTeams(Guid userId)
    {
        return context.Teams.Where(x =>
            x.TeamUsers.Any(y => y.UserId == userId) || x.OwnerId == userId
        );
    }
}
