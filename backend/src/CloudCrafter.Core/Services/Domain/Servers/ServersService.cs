using AutoMapper;
using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Server;

namespace CloudCrafter.Core.Services.Domain.Servers;

public class ServersService(IServerRepository repository, IMapper mapper) : IServersService
{
    public Task<List<ServerDto>> GetServers()
    {
        return repository.GetServers();
    }

    public Task<ServerDetailDto?> GetServer(Guid id)
    {
        return repository.GetServer(id);
    }

    public Task<bool> IsValidAgent(Guid serverId, string serverKey)
    {
        return repository.HasAgent(serverId, serverKey);
    }

    public async Task<CreatedServerDto> CreateServer(CreateServerCommand.Command request)
    {
        var server = await repository.CreateServer(request.Name);
        return mapper.Map<CreatedServerDto>(server);
    }
}
