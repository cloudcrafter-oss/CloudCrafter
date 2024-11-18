using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Domain.Domain.Server;

namespace CloudCrafter.Core.Interfaces.Domain.Servers;

public interface IServersService
{
    Task<List<ServerDto>> GetServers();
    Task<ServerDetailDto?> GetServer(Guid id);

    Task<bool> IsValidAgent(Guid serverId, string serverKey);
    Task<CreatedServerDto> CreateServer(CreateServerCommand.Command request);
    Task MarkServersStateAsUnknownAfterTimespan(TimeSpan fromMinutes);
}
