﻿using System.Text;
using CloudCrafter.Agent.Models.Docker.Filters;
using CloudCrafter.Agent.Runner.Cli.Helpers.Abstraction;
using CloudCrafter.Agent.Runner.Exceptions;
using CloudCrafter.Shared.Deployment.Docker.Labels;
using Docker.DotNet;
using Docker.DotNet.Models;

namespace CloudCrafter.Agent.Runner.Cli.Helpers;

public class DockerHelper(IDockerClientProvider provider) : IDockerHelper
{
    private readonly IDockerClient _client = provider.GetClient();

    public async Task<IList<ContainerListResponse>> GetContainersFromFilter(
        DockerContainerFilter filter
    )
    {
        var dockerFilter = new ContainersListParameters { All = true };

        if (filter.OnlyCloudCrafterLabels.GetValueOrDefault())
        {
            // TODO: Add to constructor if more filters in the future
            if (dockerFilter.Filters == null)
            {
                dockerFilter.Filters = new Dictionary<string, IDictionary<string, bool>>();
            }

            var labelFilter = new Dictionary<string, bool>
            {
                { CloudCrafterLabelKeys.CloudCrafterManaged, true },
            };
            dockerFilter.Filters.Add("label", labelFilter);
        }

        var containers = await _client.Containers.ListContainersAsync(dockerFilter);

        if (filter.LabelFilters.Count == 0)
        {
            // No filters at all, so return response as is
            return containers;
        }

        // Docker API does not allow filtering based on a label which is not equal to a certain value.
        // Hence we filter here this way.

        List<ContainerListResponse> filteredContainers = new();

        foreach (var container in containers)
        {
            var allLabelsMatch = true;
            foreach (var labelFilter in filter.LabelFilters)
            {
                if (
                    !container.Labels.TryGetValue(labelFilter.Key, out var value)
                    || value == labelFilter.Value != labelFilter.ShouldMatch
                )
                {
                    allLabelsMatch = false;
                    break;
                }
            }

            if (allLabelsMatch)
            {
                filteredContainers.Add(container);
            }
        }

        return filteredContainers;
    }

    public async Task<IList<NetworkResponse>> GetNetworks()
    {
        var networks = await _client.Networks.ListNetworksAsync();

        return networks;
    }

    public async Task StopContainers(List<string> containerIds)
    {
        if (containerIds.Count == 0)
        {
            return;
        }

        foreach (var containerId in containerIds)
        {
            await _client.Containers.StopContainerAsync(containerId, new ContainerStopParameters());
        }
    }

    public async Task RemoveContainers(List<string> containerIds)
    {
        if (containerIds.Count == 0)
        {
            return;
        }

        foreach (var containerId in containerIds)
        {
            await _client.Containers.RemoveContainerAsync(
                containerId,
                new ContainerRemoveParameters()
            );
        }
    }

    public async Task<List<string>> GetLastContainerLogs(string containerId)
    {
        var logs = await _client.Containers.GetContainerLogsAsync(
            containerId,
            true,
            new ContainerLogsParameters
            {
                Tail = "20",
                ShowStderr = true,
                ShowStdout = true,
            }
        );

        var logLines = new List<string>();
        var buffer = new byte[8192];

        while (true)
        {
            var result = await logs.ReadOutputAsync(
                buffer,
                0,
                buffer.Length,
                CancellationToken.None
            );
            if (result.EOF)
            {
                break;
            }

            var content = Encoding.UTF8.GetString(buffer, 0, result.Count);
            logLines.Add(content);
        }

        return logLines;
    }

    public async Task<DockerHelperResponseResult> RunCommandInContainer(
        string containerName,
        IList<string> commands,
        Action<DockerHelperResponse>? onLog = null
    )
    {
        var container = await GetContainer(containerName);

        var execParams = new ContainerExecCreateParameters
        {
            AttachStdout = true,
            AttachStderr = true,
            Cmd = commands,
        };

        var execCreateResponse = await _client.Exec.ExecCreateContainerAsync(
            container.ID,
            execParams
        );

        // Get the stream
        using var stream = await _client.Exec.StartAndAttachContainerExecAsync(
            execCreateResponse.ID,
            false
        );
        // Now you can read from the stream

        var buffer = new byte[81920];
        var stdout = new MemoryStream();
        var stderr = new MemoryStream();

        while (true)
        {
            var result = await stream.ReadOutputAsync(
                buffer,
                0,
                buffer.Length,
                CancellationToken.None
            );
            if (result.EOF)
            {
                break;
            }

            var content = Encoding.UTF8.GetString(buffer, 0, result.Count);

            switch (result.Target)
            {
                case MultiplexedStream.TargetStream.StandardOut:
                    onLog?.Invoke(new DockerHelperResponse { Response = content, IsStdOut = true });
                    stdout.Write(buffer, 0, result.Count);
                    break;
                case MultiplexedStream.TargetStream.StandardError:
                    onLog?.Invoke(
                        new DockerHelperResponse { Response = content, IsStdOut = false }
                    );
                    stderr.Write(buffer, 0, result.Count);
                    break;
            }
        }

        var stdoutContent = Encoding.UTF8.GetString(stdout.ToArray());
        var stderrContent = Encoding.UTF8.GetString(stderr.ToArray());

        var execInspectResponse = await _client.Exec.InspectContainerExecAsync(
            execCreateResponse.ID
        );
        var exitCode = execInspectResponse.ExitCode;
        return new DockerHelperResponseResult
        {
            ExitCode = exitCode,
            StdOut = stdoutContent,
            StdErr = stderrContent,
        };
    }

    public Task<ContainerInspectResponse> GetDockerContainer(string containerId)
    {
        return _client.Containers.InspectContainerAsync(containerId);
    }

    private async Task<ContainerInspectResponse> GetContainer(string containerName)
    {
        try
        {
            var container = await _client.Containers.InspectContainerAsync(containerName);

            if (container.State is not { Running: true })
            {
                throw new AgentDockerException(
                    $"Container with name '{containerName}' is not in running state"
                );
            }

            return container;
        }
        catch (Exception ex)
        {
            throw new AgentDockerException($"Container '{containerName}' is not running", ex);
        }
    }
}

public class DockerHelperResponse
{
    public required string Response { get; set; }
    public required bool IsStdOut { get; set; }
}

public class DockerHelperResponseResult
{
    public long ExitCode { get; init; }
    public string? StdOut { get; init; }
    public string? StdErr { get; init; }
}
