namespace CloudCrafter.Core.Interfaces.Domain.Servers;

public interface IServerConnectivityService
{
    Task PerformConnectivityCheckAsync(Guid serverId);
}
