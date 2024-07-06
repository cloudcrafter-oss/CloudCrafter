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
    private IQueryable<Server> GetBaseQuery()
    {
        return context.Servers
            .OrderBy(x => x.Name);
    }
    public async Task<List<ServerDto>> GetServers()
    {
        var servers = GetBaseQuery().AsQueryable();

        var result = await servers.ProjectTo<ServerDto>(mapper.ConfigurationProvider).ToListAsync();

        return result;
    }
}
