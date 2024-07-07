using CloudCrafter.Domain.Domain.Server;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IServerRepository
{
    Task<List<ServerDto>> GetServers();
    Task<ServerDetailDto?> GetServer(Guid id);
}
