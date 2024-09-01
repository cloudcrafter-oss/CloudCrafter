using CloudCrafter.Core.Interfaces.Domain.Environments;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Interfaces.Domain.Users;

namespace CloudCrafter.Core.Services.Domain.Users;

public class UserAccessService(IServersService serverService, IEnvironmentService environmentService) : IUserAccessService
{
    public async Task<bool> CanAccessServer(Guid userId, Guid id)
    {
        var server = await serverService.GetServer(id);
        
        // TODO: ACL check
        return server != null;
    }

    public async Task<bool> CanAccessEnvironment(Guid userId, Guid id)
    {
        var environment = await environmentService.GetEnvironment(id);
        
        // TODO: ACL check
        return environment != null;
    }
}
