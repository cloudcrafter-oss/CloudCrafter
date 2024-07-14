using CloudCrafter.DeploymentEngine.Domain.Models;
using CloudCrafter.Domain.Domain.Server;

namespace CloudCrafter.Core.Interfaces.Domain.Servers;

public interface IServersService
{
    Task<List<ServerDto>> GetServers();
    Task<ServerDetailDto?> GetServer(Guid id);
 

}
