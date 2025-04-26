using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Core.Interfaces.Domain.Environments;
using CloudCrafter.Core.Interfaces.Domain.Stacks;
using CloudCrafter.Core.Interfaces.Domain.Teams;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Constants;
using CloudCrafter.Domain.Domain.User.ACL;
using CloudCrafter.Domain.Entities.Interfaces;

namespace CloudCrafter.Core.Services.Domain.Users;

public class UserAccessService(
    IServerRepository serverRepository,
    IEnvironmentService environmentService,
    IProjectRepository projectRepository,
    IStackRepository stackRepository,
    IIdentityService identityService,
    ITeamsService teamsService
) : IUserAccessService
{
    public async Task<bool> CanAccessServer(Guid userId, Guid id)
    {
        var server = await serverRepository.GetServer(id);
        if (server == null)
        {
            return false;
        }

        return await HasEntityPermissions(server, userId, AccessType.Read);
    }

    public async Task<bool> CanAccessEnvironment(Guid userId, Guid id)
    {
        var environment = await environmentService.GetEnvironment(id);

        // TODO: ACL check
        return environment != null;
    }

    public async Task<bool> CanAccessProject(Guid userId, Guid id)
    {
        var project = await projectRepository.GetProject(id);

        // TODO: ACL check
        return project != null;
    }

    public async Task<bool> CanAccessStack(Guid userId, Guid id)
    {
        var stack = await stackRepository.GetStack(id);
        // TODO: ACL check
        return stack != null;
    }

    public Task<bool> HasEntityPermissions(IMayHaveATeam entity, Guid userId, AccessType accessType)
    {
        return UserHasPermissionToTeam(entity.TeamId, userId, accessType);
    }

    public Task<bool> HasEntityPermissions(IHaveATeam entity, Guid userId, AccessType accessType)
    {
        return UserHasPermissionToTeam(entity.TeamId, userId, accessType);
    }

    public Task EnsureHasAccessToEntity(IHaveATeam entity, Guid? userId, AccessType accessType)
    {
        return EnsureTeamAccess(entity.TeamId, userId, accessType);
    }

    public Task EnsureHasAccessToEntity(IMayHaveATeam entity, Guid? userId, AccessType accessType)
    {
        return EnsureTeamAccess(entity.TeamId, userId, accessType);
    }

    public Task EnsureHasTeamAccess(Guid? userId, Guid teamId, AccessType accessType)
    {
        return EnsureTeamAccess(teamId, userId, accessType);
    }

    public Task<bool> HasAccessToTeam(Guid userId, Guid teamId, AccessType accessType)
    {
        return UserHasPermissionToTeam(teamId, userId, accessType);
    }

    public Task<bool> HasAccessToTeam(Guid? userId, Guid teamId, AccessType accessType)
    {
        return UserHasPermissionToTeam(teamId, userId, accessType);
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

    private async Task<bool> UserHasPermissionToTeam(
        Guid? teamId,
        Guid? userId,
        AccessType accessType
    )
    {
        if (userId == null)
        {
            return false;
        }

        var isUser = await identityService.IsInRoleAsync(userId.Value, Roles.User);

        if (!isUser)
        {
            return false;
        }

        var isAdmin = await identityService.IsInRoleAsync(userId.Value, Roles.Administrator);

        if (isAdmin)
        {
            return true;
        }

        if (teamId == null)
        {
            // Regular users cannot do this
            return false;
        }

        var team = await teamsService.GetTeam(teamId.Value);

        switch (accessType)
        {
            case AccessType.Write:
                // only team owner can write
                return team.OwnerId == userId;
            case AccessType.Read:
                // only team owner or team member can read
                return team.OwnerId == userId || team.TeamUsers.Any(x => x.UserId == userId);
        }

        return false;
    }

    private async Task EnsureTeamAccess(Guid? teamId, Guid? userId, AccessType accessType)
    {
        if (userId == null)
        {
            throw new ForbiddenAccessException();
        }

        var hasAccess = await UserHasPermissionToTeam(teamId, userId, accessType);

        if (!hasAccess)
        {
            if (accessType == AccessType.Write)
            {
                throw new NotEnoughPermissionInTeamException();
            }

            throw new CannotAccessTeamException();
        }
    }
}
