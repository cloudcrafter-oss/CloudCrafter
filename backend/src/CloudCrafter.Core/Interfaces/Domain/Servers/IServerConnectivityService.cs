using CloudCrafter.Agent.SignalR.Models;

namespace CloudCrafter.Core.Interfaces.Domain.Servers;

public interface IServerConnectivityService
{
    Task PerformConnectivityCheckAsync();
    Task StoreServerInfo(Guid serverId, HealthCheckCommandArgs data);
}
