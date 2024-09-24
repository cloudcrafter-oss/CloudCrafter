using Ardalis.GuardClauses;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Domain.Server;
using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Infrastructure.Repositories;

public class ServerRepository(IApplicationDbContext context, IMapper mapper) : IServerRepository
{
    public async Task<List<ServerDto>> GetServers()
    {
        var servers = GetBaseQuery().AsQueryable();

        var result = await servers.ProjectTo<ServerDto>(mapper.ConfigurationProvider).ToListAsync();

        return result;
    }

    public Task<ServerDetailDto?> GetServer(Guid id)
    {
        var server = GetBaseQuery()
            .Where(x => x.Id == id)
            .ProjectTo<ServerDetailDto>(mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

        return server;
    }

    public async Task<Server> GetServerEntityOrFail(Guid serverId)
    {
        var server = await GetBaseQuery().Where(x => x.Id == serverId).FirstOrDefaultAsync();

        if (server == null)
        {
            throw new NotFoundException("server", "Server not found");
        }

        return server;
    }

    public async Task<bool> HasAgent(Guid serverId, string serverKey)
    {
        // We check first for the server ID, because the key is encrypted.
        // Thus, we cannot query on it.
        var serverDetails = await GetBaseQuery().Where(x => x.Id == serverId).FirstOrDefaultAsync();

        if (serverDetails is null)
        {
            return false;
        }

        return serverDetails.AgentSecretKey == serverKey;
    }

    private IQueryable<Server> GetBaseQuery()
    {
        return context.Servers.OrderBy(x => x.Name);
    }
}
