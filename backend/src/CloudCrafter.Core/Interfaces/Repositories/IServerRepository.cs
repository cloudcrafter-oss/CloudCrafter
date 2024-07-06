using CloudCrafter.Domain.Domain.Server;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IServerRepository
{
    Task<List<ServerDto>> GetServers();
}
