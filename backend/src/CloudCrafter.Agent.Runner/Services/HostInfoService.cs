using System.Diagnostics;
using System.Runtime.InteropServices;
using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Shared.Utils.Cli.Abstraction;

namespace CloudCrafter.Agent.Runner.Services;

public class HostInfoService(ICommandExecutor commandExecutor)
{
    public async Task<HostInfo> GetHostInfo()
    {
        var dockerVersionTask = GetDockerVersion();
        var systemInfoTask = GetSystemInfo();

        await Task.WhenAll(dockerVersionTask, systemInfoTask);

        var dockerVersion = await dockerVersionTask;
        var systemInfo = await systemInfoTask;

        var osInfo = GetOsInfo();
        return new HostInfo
        {
            OsInfo = osInfo,
            DockerVersion = dockerVersion,
            SystemInfo = systemInfo,
        };
    }

    private string GetOsInfo()
    {
        return RuntimeInformation.OSDescription;
    }

    private async Task<string> GetDockerVersion()
    {
        try
        {
            var command = await commandExecutor.ExecuteAsync(
                "docker",
                ["version", "--format", "{{json .}}"]
            );
            var output = command.StdOut;
            return output ?? "Docker not found or error occurred";
        }
        catch (Exception)
        {
            return "Docker not found or error occurred";
        }
    }

    private async Task<SystemInfo> GetSystemInfo()
    {
        var startCpuUsage = Process.GetCurrentProcess().TotalProcessorTime;
        var startTime = DateTime.UtcNow;

        await Task.Delay(500);

        var endCpuUsage = Process.GetCurrentProcess().TotalProcessorTime;
        var endTime = DateTime.UtcNow;

        var cpuUsedMs = (endCpuUsage - startCpuUsage).TotalMilliseconds;
        var totalMsPassed = (endTime - startTime).TotalMilliseconds;
        var cpuUsageTotal = cpuUsedMs / (Environment.ProcessorCount * totalMsPassed);

        var totalMemory = GC.GetGCMemoryInfo().TotalAvailableMemoryBytes;
        var usedMemory = Process.GetCurrentProcess().WorkingSet64;

        return new SystemInfo
        {
            CpuUsagePercentage = Math.Round(cpuUsageTotal * 100, 2),
            TotalCpuCount = Environment.ProcessorCount,
            MemoryUsagePercentage = Math.Round((double)usedMemory / totalMemory * 100, 2),
            TotalMemoryBytes = totalMemory,
        };
    }
}
