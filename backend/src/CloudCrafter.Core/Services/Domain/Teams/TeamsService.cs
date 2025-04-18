using CloudCrafter.Core.Interfaces.Domain.Teams;
using CloudCrafter.Core.Interfaces.Repositories;

namespace CloudCrafter.Core.Services.Domain.Teams;

public class TeamsService(ITeamsRepository repository) : ITeamsService
{
    public Task<Guid> CreateTeam(string name, Guid ownerId)
    {
        return repository.CreateTeam(name, ownerId);
    }

    public Task DeleteTeam(Guid teamId)
    {
        return repository.DeleteTeam(teamId);
    }

    public Task UpdateTeamName(Guid teamId, string name)
    {
        return repository.UpdateTeamName(teamId, name);
    }
}
