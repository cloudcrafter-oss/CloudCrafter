﻿using Ardalis.GuardClauses;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Core.Utils;
using CloudCrafter.Domain.Domain.Server;
using CloudCrafter.Domain.Domain.Server.Filter;
using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.Infrastructure.Repositories;

public class ServerRepository(IApplicationDbContext context, IMapper mapper) : IServerRepository
{
    public async Task<List<ServerDto>> GetServers(ServerFilter filter)
    {
        var servers = GetFilteredServers(filter);

        var result = await servers.ProjectTo<ServerDto>(mapper.ConfigurationProvider).ToListAsync();

        return result;
    }

    public async Task<List<Server>> FilterServers(ServerFilter filter)
    {
        var servers = GetFilteredServers(filter);

        return await servers.ToListAsync();
    }

    public async Task<Server?> GetServer(Guid id)
    {
        var server = await GetBaseQuery().Where(x => x.Id == id).FirstOrDefaultAsync();

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
        server.PingHealthData.SetStatus(ServerStatusValue.Connected);

        await context.SaveChangesAsync();
    }

    public async Task<Server> CreateServer(string name, Guid? teamId)
    {
        var server = new Server
        {
            Id = Guid.NewGuid(),
            Name = name,
            TeamId = teamId,
            AgentSecretKey = StringUtils.GenerateSecret(64),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            DockerDataDirectoryMount = "",
            IpAddress = "",
            DockerNetwork = "cloudcrafter",
            PingHealthData = new ServerPingData(),
            SshPort = 22,
        };

        context.Servers.Add(server);

        await context.SaveChangesAsync();

        return server;
    }

    public Task SaveChangesAsync()
    {
        return context.SaveChangesAsync();
    }

    public async Task DeleteServer(Guid id)
    {
        var server = await GetBaseQuery().Where(x => x.Id == id).FirstOrDefaultAsync();

        if (server == null)
        {
            return;
        }

        context.Servers.Remove(server);

        await context.SaveChangesAsync();
    }

    private IQueryable<Server> GetFilteredServers(ServerFilter filter)
    {
        var servers = GetBaseQuery();

        if (filter.HealthCheckAgeOlderThan.HasValue)
        {
            servers =
                from zz in servers
                where
                    !zz.PingHealthData.LastPingAt.HasValue
                    || zz.PingHealthData.LastPingAt.Value
                        < DateTime.UtcNow - filter.HealthCheckAgeOlderThan.Value
                select zz;
        }

        if (filter.UserId.HasValue)
        {
            servers =
                from zz in servers
                where
                    zz.TeamId.HasValue
                    && zz.Team != null
                    && (
                        zz.Team.OwnerId == filter.UserId.Value
                        || zz.Team.TeamUsers.Any(x => x.UserId == filter.UserId.Value)
                    )
                select zz;
        }

        return servers;
    }

    private IQueryable<Server> GetBaseQuery()
    {
        return context.Servers.OrderBy(x => x.CreatedAt);
    }
}
