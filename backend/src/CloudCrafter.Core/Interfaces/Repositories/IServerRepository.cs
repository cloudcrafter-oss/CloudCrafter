using CloudCrafter.Domain.Domain.Server;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IServerRepository
{
    Task<List<ServerDto>> GetServers();
    Task<ServerDetailDto?> GetServer(Guid id);
    Task<Server> GetServerEntityOrFail(Guid serverId);
}
