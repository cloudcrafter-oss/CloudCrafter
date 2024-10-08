using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Domain.Agent;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.DeploymentEngine.Engine.Brewery.RecipeGenerators;
using CloudCrafter.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Stacks;

public class DeployStackBackgroundJob : BaseDeploymentJob, IJob
{
    private Deployment? _deployment;
    private BackgroundJob? _job;

    public DeployStackBackgroundJob() { }

    public DeployStackBackgroundJob(Guid deploymentId)
    {
        DeploymentId = deploymentId;
    }

    public Guid DeploymentId { get; set; }

    public BackgroundJobType Type => BackgroundJobType.StackDeployment;
    public bool ShouldRunOnApiServer => false;

    public async Task HandleEntity(IApplicationDbContext context, string jobId)
    {
        _job = await context.Jobs.Where(x => x.HangfireJobId == jobId).FirstOrDefaultAsync();

        if (_job == null)
        {
            throw new ArgumentNullException(nameof(jobId), "Job not found");
        }

        _deployment = await context
            .Deployments.Where(x => x.Id == DeploymentId)
            .Include(x => x.Stack)
            .ThenInclude(x => x.Services)
            .Include(x => x.Stack)
            .ThenInclude(stack => stack.Server)
            .FirstOrDefaultAsync();

        if (_deployment == null || _deployment.Stack == null || _deployment.Stack.Server == null)
        {
            throw new ArgumentNullException(nameof(DeploymentId), "Deployment or stack not found");
        }

        if (string.IsNullOrEmpty(_deployment.Stack.Server.DockerDataDirectoryMount))
        {
            throw new ArgumentNullException(
                nameof(_deployment.Stack.Server.DockerDataDirectoryMount),
                "DockerDataDirectoryMount is not set"
            );
        }
    }

    public Task TearDown()
    {
        return Task.CompletedTask;
    }

    public async Task Handle(
        IServiceProvider serviceProvider,
        IApplicationDbContext context,
        ILoggerFactory loggerFactory,
        string jobId
    )
    {
        var logger = loggerFactory.CreateLogger<DeployStackBackgroundJob>();

        logger.LogDebug(
            "Starting deployment for stack ({StackId}), deploymentId: {DeploymentId}",
            _deployment!.StackId,
            DeploymentId
        );

        logger.LogDebug("Brewing recipe...");
        var recipeGenerator = new SimpleAppRecipeGenerator(
            new BaseRecipeGenerator.Args
            {
                Stack = _deployment!.Stack,
                DeploymentId = _deployment!.Id,
            }
        );
        var recipe = recipeGenerator.Generate();
        logger.LogDebug("Recipe brewed!");

        var agentManager = serviceProvider.GetRequiredService<IAgentManager>();

        logger.LogDebug("Sending recipe to agent...");
        await agentManager.SendRecipeToAgent(_deployment.Stack.ServerId, recipe);
        logger.LogDebug("Recipe sent to agent!");
    }
}
