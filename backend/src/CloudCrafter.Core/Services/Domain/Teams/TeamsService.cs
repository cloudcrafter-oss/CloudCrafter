using AutoMapper;
using CloudCrafter.Core.Interfaces.Domain.Teams;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Teams;

namespace CloudCrafter.Core.Services.Domain.Teams;

public class TeamsService(ITeamsRepository repository, IMapper mapper) : ITeamsService
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

    public async Task<List<SimpleTeamDto>> GetTeams(Guid userId)
    {
        var teams = await repository.GetTeamsForUser(userId);

        return mapper.Map<List<SimpleTeamDto>>(teams);
    }

    public async Task<List<SimpleTeamDto>> GetAllTeams()
    {
        var teams = await repository.GetAllTeams();

        return mapper.Map<List<SimpleTeamDto>>(teams);
    }
}
