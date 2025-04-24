using CloudCrafter.Domain.Entities.Interfaces;

namespace CloudCrafter.Core.Interfaces.Domain.Users;

public interface IUserAccessService
{
    public Task<bool> CanAccessServer(Guid userId, Guid id);
    public Task<bool> CanAccessEnvironment(Guid userId, Guid id);
    public Task<bool> CanAccessProject(Guid userId, Guid id);
    public Task<bool> CanAccessStack(Guid userId, Guid id);
    public Task<bool> CanMutateEntity(IMayHaveATeam entity, Guid userId);
    public Task<bool> CanMutateEntity(IHaveATeam entity, Guid userId);

    public Task EnsureCanMutateEntity(IHaveATeam entity, Guid userId);
    public Task EnsureCanMutateEntity(IMayHaveATeam entity, Guid userId);
}
