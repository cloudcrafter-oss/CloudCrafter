using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text;
using Hangfire;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Hangfire;

public class HangfireServerSelector
{
    private readonly ILogger<HangfireServerSelector> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly ConcurrentDictionary<string, string> _userServerMapping = new();
    private HashSet<string> _currentServers = new();
    private SortedDictionary<uint, string> _hashRing = new();

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
            var allServers = JobStorage.Current.GetMonitoringApi().Servers().ToList();

            servers = allServers.Select(s => s.Name.Split(':').FirstOrDefault() ?? s.Name).ToList();
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
                var key = HashKey($"{server}");
                newHashRing[key] = server;
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

    public string GetServerForHash(string hashId)
    {
        return _userServerMapping.GetOrAdd(
            hashId,
            _ =>
            {
                var userHash = HashKey(hashId);
                var serverNode = _hashRing.FirstOrDefault(x => x.Key >= userHash);
                return serverNode.Value ?? _hashRing.First().Value;
            }
        );
    }
}
