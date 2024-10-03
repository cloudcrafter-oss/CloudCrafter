using CloudCrafter.Agent.SignalR.Models;

namespace CloudCrafter.Core.Interfaces.Domain.Servers;

public interface IServerConnectivityService
{
    Task PerformConnectivityCheckAsync(Guid serverId);
    Task StoreServerInfo(Guid serverId, HealthCheckCommandArgs data);
}
