using CloudCrafter.Domain.Domain.User.ACL;
using CloudCrafter.Domain.Entities.Interfaces;

namespace CloudCrafter.Core.Interfaces.Domain.Users;

public interface IUserAccessService
{
    public Task<bool> CanAccessServer(Guid userId, Guid id);
    public Task<bool> CanAccessEnvironment(Guid userId, Guid id);
    public Task<bool> CanAccessProject(Guid userId, Guid id);
    public Task<bool> CanAccessStack(Guid userId, Guid id);
    public Task<bool> HasEntityPermissions(
        IMayHaveATeam entity,
        Guid userId,
        AccessType accessType
    );
    public Task<bool> HasEntityPermissions(IHaveATeam entity, Guid userId, AccessType accessType);
    public Task EnsureHasAccessToEntity(IHaveATeam entity, Guid? userId, AccessType accessType);
    public Task EnsureHasAccessToEntity(IMayHaveATeam entity, Guid? userId, AccessType accessType);
    public Task EnsureHasTeamAccess(Guid? userId, Guid teamId, AccessType accessType);
    public Task<bool> HasAccessToTeam(Guid userId, Guid teamId, AccessType accessType);
    public Task<bool> HasAccessToTeam(Guid? userId, Guid teamId, AccessType accessType);
    public Task<bool> IsAdministrator(Guid? userId);
}
