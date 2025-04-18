using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Entities;

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
            return;
        }

        context.Teams.Remove(team);
        await context.SaveChangesAsync();
    }

    public async Task UpdateTeamName(Guid teamId, string name)
    {
        var team = await context.Teams.FindAsync(teamId);
        if (team == null)
        {
            return;
        }

        team.Name = name;
        await context.SaveChangesAsync();
    }
}
