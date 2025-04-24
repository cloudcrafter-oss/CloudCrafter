using AutoMapper;
using CloudCrafter.Core.Commands.Servers;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Events.DomainEvents.Server;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Interfaces.Domain.Users;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Core.Utils;
using CloudCrafter.Domain.Common;
using CloudCrafter.Domain.Domain.Server;
using CloudCrafter.Domain.Domain.Server.Filter;
using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Core.Services.Domain.Servers;

public class ServersService(
    IServerRepository repository,
    IMapper mapper,
    IUserAccessService accessService,
    IUser user
) : IServersService
{
    public async Task<List<ServerDto>> GetServers()
    {
        var isAdmin = await accessService.IsAdministrator(user.Id);

        var filter = new ServerFilter();

        if (!isAdmin)
        {
            filter.UserId = user.Id;
        }

        return await repository.GetServers(filter);
    }

    public async Task<ServerDetailDto?> GetServer(Guid id)
    {
        var server = await repository.GetServer(id);
        if (server == null)
        {
            return null;
        }

        await accessService.EnsureCanMutateEntity(server, user.Id);

        return mapper.Map<ServerDetailDto>(server);
    }

    public Task SaveChangesAsync()
    {
        return repository.SaveChangesAsync();
    }

    public Task<bool> IsValidAgent(Guid serverId, string serverKey)
    {
        return repository.HasAgent(serverId, serverKey);
    }

    public async Task<CreatedServerDto> CreateServer(CreateServerCommand request)
    {
        var server = await repository.CreateServer(request.Name, request.TeamId);
        return mapper.Map<CreatedServerDto>(server);
    }

    public async Task MarkServersStateAsUnknownAfterTimespan(TimeSpan fromMinutes)
    {
        var servers = await repository.FilterServers(
            new ServerFilter { HealthCheckAgeOlderThan = fromMinutes }
        );

        foreach (var server in servers)
        {
            server.PingHealthData.SetStatus(ServerStatusValue.Unknown);
        }

        await repository.SaveChangesAsync();
    }

    public async Task DeleteServer(Guid id)
    {
        var server = await repository.GetServerEntityOrFail(id);
        await accessService.EnsureCanMutateEntity(server, user.Id);

        try
        {
            await repository.DeleteServer(id);
        }
        catch (DbUpdateException)
        {
            throw new ValidationException(ValidationExceptionHelper.ServerHasExistingResources());
        }
    }

    public async Task RotateServerKey(Guid id)
    {
        var server = await repository.GetServerEntityOrFail(id);

        server.UpdateServerAgentKey(StringUtils.GenerateSecret(64));
        server.AddDomainEvent(
            DomainEventDispatchTiming.AfterSaving,
            new ServerAgentKeyUpdatedEvent(server)
        );
        await repository.SaveChangesAsync();
    }

    public async Task UpdateServer(Guid id, UpdateServerDto updateDto)
    {
        var server = await repository.GetServerEntityOrFail(id);

        if (updateDto.Name is not null)
        {
            server.Name = updateDto.Name;
        }

        if (updateDto.DockerNetwork is not null)
        {
            server.DockerNetwork = updateDto.DockerNetwork;
        }

        await repository.SaveChangesAsync();
    }
}
