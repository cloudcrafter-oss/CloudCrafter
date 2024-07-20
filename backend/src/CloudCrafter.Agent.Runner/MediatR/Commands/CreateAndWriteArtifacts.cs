using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using MediatR;

namespace CloudCrafter.Agent.Runner.MediatR.Commands;

public static class CreateAndWriteArtifacts
{
    public record Query(DeploymentContext Context) : IRequest;

    private class Handler(IMessagePump pump) : IRequestHandler<Query>
    {
        private readonly IDeploymentLogger Logger = pump.CreateLogger<Handler>();

        public Task Handle(Query request, CancellationToken cancellationToken)
        {
            Logger.LogInfo("Creating deployment artifacts directory");

            var workingDir = request.Context.GetWorkingDirectory();

            if (!request.Context.IsDryRun)
            {
                if (!Directory.Exists(workingDir))
                {
                    Directory.CreateDirectory(workingDir);
                }
            }

            Logger.LogInfo($"Directory '{workingDir}' created");

            return Task.CompletedTask;
        }
    }
}
