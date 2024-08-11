using CloudCrafter.Agent.Models.Docker.Filters;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.Cli.Helpers.Abstraction;
using CloudCrafter.Agent.Runner.Commands;
using CloudCrafter.Agent.Runner.IO;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Agent.Runner;

public class AgentRunner(IHost host)
{
    public async Task<int> Run(bool useDummyDeployment, string base64Recipe)
    {
        var logger = host.Services.GetRequiredService<ILogger<AgentRunner>>();
        
        // Base validation
        if(!string.IsNullOrWhiteSpace(base64Recipe) && useDummyDeployment)
        {
            logger.LogCritical("Cannot use both --demo and --from-base64 options");
            return -1;
        }
        
        // Test code

        var dockerHelper = host.Services.GetRequiredService<IDockerHelper>();

        var hosts = await dockerHelper.GetContainersFromFilter(new DockerContainerFilter()
        {
            LabelFilters = new List<DockerLabelFilter>()
            {
                DockerLabelFilter.Parse("cloudcrafter.application=0e038998-c7c0-4fb6-bf35-187b6e9cbcb5"),
                DockerLabelFilter.Parse("cloudcrafter.deployment!=943c2a2d-f794-403a-9c91-0f1086a034bf")
            }
        });

        var mediator = host.Services.GetRequiredService<IMediator>();
        
        
        DeploymentRecipe? recipe = null;

        if (useDummyDeployment)
        {
            var random = new Random();
            var randomString = new string(Enumerable.Repeat("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10)
                .Select(s => s[random.Next(s.Length)]).ToArray());

            var applicationId = Guid.Parse("4676dae2-08a5-4a5d-a5f6-5b02a3a77ac7");
            recipe = await mediator.Send(new GetDummyDeployment.Query("custom-image", randomString, applicationId));
        }
        
        if (!string.IsNullOrWhiteSpace(base64Recipe))
        {
            var reader = new YamlRecipeReader();
            recipe = reader.FromBase64(base64Recipe);
        }


        if (recipe == null)
        {
            logger.LogCritical("Error: No Recipe found - cannot continue");
            return -1;
        }


        var deploymentService = host.Services.GetRequiredService<DeploymentService>();

        try
        {
            await deploymentService.ValidateRecipe(recipe);
        }
        catch (Exception ex)
        {
            logger.LogCritical("Error validating recipe: {0}", ex.Message);
            return -1;
        }


        try
        {
            await deploymentService.DeployAsync(recipe);
        }
        catch (Exception ex)
        {
            logger.LogCritical("Error deploying recipe: {0}", ex.Message);
            return -1;
        }

        return 0;
    }
}
