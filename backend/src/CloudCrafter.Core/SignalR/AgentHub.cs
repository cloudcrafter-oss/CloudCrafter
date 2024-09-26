using System.Collections.Concurrent;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.SignalR;

public class AgentHub(IServersService serversService, ILogger<AgentHub> logger) : Hub
{
    public static ConcurrentDictionary<string, Guid> ConnectedClients { get; } = new();

    public Task TestCommand(string test)
    {
        var clientId = Context.ConnectionId;
        logger.LogCritical(
            "Received TestCommand from client {ClientId} with value: {Value}",
            clientId,
            test
        );

        return Task.CompletedTask;
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();

        if (httpContext is null)
        {
            // We simply cannot continue.
            logger.LogCritical("HttpContext is null - aborting context");
            Context.Abort();
            return;
        }

        var agentId = httpContext.Request.Query["agentId"].ToString();
        var agentKey = httpContext.Request.Query["agentKey"].ToString();

        if (string.IsNullOrEmpty(agentId) || string.IsNullOrEmpty(agentKey))
        {
            logger.LogCritical("AgentId or AgentKey is null - aborting context");
            Context.Abort();
            return;
        }

        if (!Guid.TryParse(agentId, out var serverId))
        {
            logger.LogCritical("AgentId is not a Guid - aborting context");
            Context.Abort();
            return;
        }

        var isValidAgent = await serversService.IsValidAgent(serverId, agentKey);
        if (!isValidAgent)
        {
            logger.LogCritical("AgentId or AgentKey is invalid - aborting context");
            Context.Abort();
            return;
        }

        var ip = GetClientIpAddress(httpContext);

        logger.LogDebug("Agent connected from : {AgentId}@{Ip}", agentId, ip);

        var clientId = Context.ConnectionId;
        ConnectedClients.TryAdd(clientId, serverId);
        await base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        var clientId = Context.ConnectionId;
        ConnectedClients.TryRemove(clientId, out _);
        return base.OnDisconnectedAsync(exception);
    }

    private string GetClientIpAddress(HttpContext context)
    {
        var ip = context.Connection?.RemoteIpAddress?.ToString();

        if (string.IsNullOrEmpty(ip))
        {
            ip = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        }

        if (string.IsNullOrEmpty(ip))
        {
            ip = context.Connection?.RemoteIpAddress?.MapToIPv4().ToString();
        }

        return ip ?? "Unknown";
    }
}
