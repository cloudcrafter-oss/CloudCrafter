using System.Reflection.Metadata;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Cli;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using MediatR;

namespace CloudCrafter.Agent.Runner.MediatR.Commands;

public static class CleanupArtifactsDirectory
{
    public record Query(DeploymentContext Context) : IRequest;
    
    private class Handler(IMessagePump pump, ICommandExecutor commandExecutor) : IRequestHandler<Query>
    {
        private readonly IDeploymentLogger Logger = pump.CreateLogger<Handler>();
        
        public async  Task Handle(Query request, CancellationToken cancellationToken)
        {
            Logger.LogInfo("Cleaning up deployment artifacts directory");
            var workingDir = request.Context.GetWorkingDirectory();

            await commandExecutor.ExecuteAsync("rm", $"-rf {workingDir}");
            Logger.LogInfo($"Directory {workingDir} removed");
        }
    }
}
