using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Domain.Domain.Server;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Core.Interfaces.Repositories;

public interface IServerRepository
{
    Task<List<ServerDto>> GetServers();
    Task<ServerDetailDto?> GetServer(Guid id);
    Task<Server> GetServerEntityOrFail(Guid serverId);
    Task<bool> HasAgent(Guid serverId, string serverKey);
    Task StoreServerInfo(Guid serverId, HealthCheckCommandArgs data);
    Task<Server> CreateServer(string requestName);
}
