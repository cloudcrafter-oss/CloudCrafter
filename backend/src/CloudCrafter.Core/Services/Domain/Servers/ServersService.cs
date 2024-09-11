using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.DeploymentEngine.Domain.Models;
using CloudCrafter.DeploymentEngine.Remote.Manager;
using CloudCrafter.Domain.Domain.Server;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Services.Domain.Servers;

public class ServersService(IServerRepository repository) : IServersService
{
    public Task<List<ServerDto>> GetServers()
    {
        return repository.GetServers();
    }

    public Task<ServerDetailDto?> GetServer(Guid id)
    {
        return repository.GetServer(id);
    }
}
