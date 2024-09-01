namespace CloudCrafter.Core.Interfaces.Domain.Users;

public interface IUserAccessService
{
    public Task<bool> CanAccessServer(Guid userId, Guid id);
    public Task<bool> CanAccessEnvironment(Guid userId, Guid id);
    public Task<bool> CanAccessProject(Guid userId, Guid id);
}
