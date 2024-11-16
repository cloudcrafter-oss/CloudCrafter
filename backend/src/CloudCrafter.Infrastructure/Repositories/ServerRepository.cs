using Ardalis.GuardClauses;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Core.Utils;
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

    public async Task StoreServerInfo(Guid serverId, HealthCheckCommandArgs data)
    {
        var server = await GetServerEntityOrFail(serverId);

        server.PingHealthData.LastPingAt = data.Timestamp;
        server.PingHealthData.DockerVersion = data.HostInfo.DockerVersion;
        server.PingHealthData.CpuUsagePercentage = data.HostInfo.SystemInfo.CpuUsagePercentage;
        server.PingHealthData.TotalCpuCount = data.HostInfo.SystemInfo.TotalCpuCount;
        server.PingHealthData.MemoryUsagePercentage = data.HostInfo
            .SystemInfo
            .MemoryUsagePercentage;
        server.PingHealthData.TotalMemoryBytes = data.HostInfo.SystemInfo.TotalMemoryBytes;
        server.PingHealthData.OsInfo = data.HostInfo.OsInfo;

        await context.SaveChangesAsync();
    }

    public async Task<Server> CreateServer(string requestName)
    {
        var server = new Server
        {
            Id = Guid.NewGuid(),
            Name = requestName,
            AgentSecretKey = StringUtils.GenerateSecret(64),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            DockerDataDirectoryMount = "",
            IpAddress = "",
            PingHealthData = new ServerPingData(),
            SshPort = 22,
        };

        context.Servers.Add(server);

        await context.SaveChangesAsync();

        return server;
    }

    private IQueryable<Server> GetBaseQuery()
    {
        return context.Servers.OrderBy(x => x.Name);
    }
}
