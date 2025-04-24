using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Core.Interfaces.Domain.Environments;
using CloudCrafter.Core.Interfaces.Domain.Projects;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Teams;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Constants;
using CloudCrafter.Domain.Entities.Interfaces;

namespace CloudCrafter.Core.Services.Domain.Users;

public class UserAccessService(
    IServerRepository serverRepository,
    IEnvironmentService environmentService,
    IProjectsService projectsService,
    IStacksService stacksService,
    IIdentityService identityService,
    ITeamsService teamsService
) : IUserAccessService
{
    public async Task<bool> CanAccessServer(Guid userId, Guid id)
    {
        var server = await serverRepository.GetServer(id);

        // TODO: ACL check
        return server != null;
    }

    public async Task<bool> CanAccessEnvironment(Guid userId, Guid id)
    {
        var environment = await environmentService.GetEnvironment(id);

        // TODO: ACL check
        return environment != null;
    }

    public async Task<bool> CanAccessProject(Guid userId, Guid id)
    {
        var project = await projectsService.GetProject(id);

        // TODO: ACL check
        return project != null;
    }

    public async Task<bool> CanAccessStack(Guid userId, Guid id)
    {
        var stack = await stacksService.GetSimpleStackDetails(id);
        // TODO: ACL check
        return stack != null;
    }

    public Task<bool> CanMutateEntity(IMayHaveATeam entity, Guid userId)
    {
        return UserCanMutate(entity.TeamId, userId);
    }

    public Task<bool> CanMutateEntity(IHaveATeam entity, Guid userId)
    {
        return UserCanMutate(entity.TeamId, userId);
    }

    public async Task EnsureCanMutateEntity(IHaveATeam entity, Guid? userId)
    {
        if (userId == null)
        {
            throw new ForbiddenAccessException();
        }

        var canMutate = await CanMutateEntity(entity, userId.Value);

        if (!canMutate)
        {
            throw new ForbiddenAccessException();
        }
    }

    public async Task EnsureCanMutateEntity(IMayHaveATeam entity, Guid? userId)
    {
        if (userId == null)
        {
            throw new ForbiddenAccessException();
        }

        var canMutate = await CanMutateEntity(entity, userId.Value);

        if (!canMutate)
        {
            throw new ForbiddenAccessException();
        }
    }

    public async Task<bool> IsAdministrator(Guid? userId)
    {
        if (userId == null)
        {
            return false;
        }

        var isAdmin = await identityService.IsInRoleAsync(userId.Value, Roles.Administrator);

        return isAdmin;
    }

    private async Task<bool> UserCanMutate(Guid? teamId, Guid userId)
    {
        var isUser = await identityService.IsInRoleAsync(userId, Roles.User);

        if (!isUser)
        {
            // Non-users may never mutate!
            return false;
        }

        var isAdmin = await identityService.IsInRoleAsync(userId, Roles.Administrator);

        if (isAdmin)
        {
            // Administrators can always do everything
            return true;
        }

        if (teamId == null)
        {
            // If it is a global instance entity, it should always be an administrator.
            // If it is not an administrator, we cannot mutate.
            return isAdmin;
        }

        var team = await teamsService.GetTeam(teamId.Value);

        // At this point, the user is always a User role.
        // The user may only mutate if the user is the owner of the Team.
        return team.OwnerId == userId;
    }
}
