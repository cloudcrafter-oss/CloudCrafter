using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text;
using CloudCrafter.Core.Jobs.Dispatcher;
using Hangfire;
using Hangfire.States;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Hangfire;

public class HangfireServerSelector
{
    private const int VirtualNodes = 100;
    private readonly ILogger<HangfireServerSelector> _logger;
    private readonly ConcurrentDictionary<string, string> _userServerMapping = new();
    private HashSet<string> _currentServers = new();
    private SortedDictionary<uint, string> _hashRing = new();
    private readonly IServiceProvider _serviceProvider;

    public HangfireServerSelector(
        ILogger<HangfireServerSelector> logger,
        IServiceProvider serviceProvider
    )
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
        RefreshServerList();
    }

    public bool RefreshServerList()
    {
        List<string> servers = [];
        try
        {
            servers = JobStorage.Current.GetMonitoringApi().Servers().Select(s => s.Name).ToList();
        }
        catch
        {
            // ignored
        }

        var newHashRing = new SortedDictionary<uint, string>();
        var newServers = new HashSet<string>(servers);

        var hasChanges = !_currentServers.SetEquals(newServers);
        if (hasChanges)
        {
            _logger.LogDebug("Detected changes in server list, updating hash ring");
            foreach (var server in servers)
            {
                for (var i = 0; i < VirtualNodes; i++)
                {
                    var key = HashKey($"{server}:{i}");
                    newHashRing[key] = server;
                }
            }

            var removedServers = _currentServers.Except(newServers).ToList();
            _hashRing = newHashRing;
            _currentServers = newServers;

            foreach (var server in removedServers)
            {
                RemoveServerFromMapping(server);
            }
        }

        return hasChanges;
    }

    private void RemoveServerFromMapping(string serverName)
    {
        foreach (var kvp in _userServerMapping.ToList())
        {
            if (kvp.Value == serverName)
            {
                _logger.LogWarning(
                    "Removing user {UserId} from server {ServerName}",
                    kvp.Key,
                    serverName
                );
                _userServerMapping.TryRemove(kvp.Key, out _);
            }
        }
    }

    private static uint HashKey(string key)
    {
        using (var md5 = MD5.Create())
        {
            var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(key));
            return BitConverter.ToUInt32(hash, 0);
        }
    }

    public string GetServerForHash(string userId)
    {
        return _userServerMapping.GetOrAdd(
            userId,
            _ =>
            {
                var userHash = HashKey(userId);
                var serverNode = _hashRing.FirstOrDefault(x => x.Key >= userHash);
                return serverNode.Value ?? _hashRing.First().Value;
            }
        );
    }
}
