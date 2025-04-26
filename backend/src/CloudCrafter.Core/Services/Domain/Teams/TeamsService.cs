using AutoMapper;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Core.Interfaces.Domain.Teams;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Teams;
using CloudCrafter.Domain.Domain.User.ACL;
using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Core.Services.Domain.Teams;

public class TeamsService(
    ITeamsRepository repository,
    IMapper mapper,
    IUserAccessService userAccessService,
    IUser user
) : ITeamsService
{
    public Task<Guid> CreateTeam(string name, Guid ownerId)
    {
        return repository.CreateTeam(name, ownerId);
    }

    public async Task DeleteTeam(Guid teamId)
    {
        await userAccessService.EnsureHasTeamAccess(user?.Id, teamId, AccessType.Write);

        try
        {
            await repository.DeleteTeam(teamId);
        }
        catch (DbUpdateException)
        {
            throw new ValidationException(ValidationExceptionHelper.TeamHasExistingResources());
        }
    }

    public Task UpdateTeamName(Guid teamId, string name)
    {
        return repository.UpdateTeamName(teamId, name);
    }

    public Task<Team> GetTeam(Guid teamId)
    {
        return repository.GetTeam(teamId);
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

    public async Task<
        List<SimpleTeamWithProjectsAndEnvironmentsDto>
    > GetTeamsWithProjectsAndEnvironments(Guid userId)
    {
        var teams = await repository.GetTeamsWithProjectsAndEnvironments(userId);

        return mapper.Map<List<SimpleTeamWithProjectsAndEnvironmentsDto>>(teams);
    }
}
