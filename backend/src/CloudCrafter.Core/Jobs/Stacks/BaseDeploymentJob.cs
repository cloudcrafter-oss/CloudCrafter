using CloudCrafter.Agent.Models.IO;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Core.Config;
using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.DeploymentEngine.Domain.Commands;
using CloudCrafter.DeploymentEngine.Remote.Clients.Contracts;
using CloudCrafter.DeploymentEngine.Remote.Manager;
using CloudCrafter.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Stacks;

public abstract class BaseDeploymentJob
{
    protected CloudCrafterEngineManager GetEngineManager(
        IServerConnectivityService connectivityService,
        Server server
    )
    {
        return connectivityService.CreateEngineManager(server);
    }

    protected async Task PullHelperImage(
        ILogger<BaseDeploymentJob> logger,
        ICloudCrafterRemoteClient client,
        ICommonCommandGenerator commonCommandGenerator
    )
    {
        logger.LogDebug("Pulling helper image");
        await client.ExecuteCommandAsync(
            commonCommandGenerator.PullDockerImage(DynamicConfig.HelperImage),
            true
        );

        var imageIdResult = await client.ExecuteCommandAsync(
            commonCommandGenerator.VerifyDockerImageExists(DynamicConfig.HelperImage)
        );
        logger.LogDebug("Helper image pulled with ID: {ImageId}", imageIdResult.Result);
    }

    protected async Task<ExecutedCommandDetails> RunInContainer(
        ILogger<BaseDeploymentJob> logger,
        ICloudCrafterRemoteClient client,
        ICommonCommandGenerator commonCommandGenerator,
        string containerId,
        string command
    )
    {
        logger.LogDebug(
            "Running command in container {ContainerId}: {Command}",
            containerId,
            command
        );
        var containerCommand = commonCommandGenerator.RunInDockerContainer(containerId, command);

        logger.LogDebug("Running command: {Command}", containerCommand);

        var result = await client.ExecuteCommandAsync(containerCommand);

        logger.LogDebug("Command executed with result: {Result}", result.Result);

        return result;
    }

    protected async Task<string> CreateDockerContainer(
        ILogger<BaseDeploymentJob> logger,
        ICloudCrafterRemoteClient client,
        ICommonCommandGenerator commonCommandGenerator,
        Guid deploymentId
    )
    {
        logger.LogDebug("Creating Agent-container for deployment");

        var command = commonCommandGenerator.CreateHelperContainer(
            deploymentId,
            DynamicConfig.HelperImage
        );

        var result = await client.ExecuteCommandAsync(command);
        logger.LogDebug("Agent-container created with ID: {ContainerId}", result.Result);

        return result.Result;
    }

    protected async Task<string> WriteRecipeToFile(
        ILogger<BaseDeploymentJob> logger,
        ICloudCrafterRemoteClient client,
        ICommonCommandGenerator commonCommandGenerator,
        DeploymentRecipe recipe,
        string dockerContainerId
    )
    {
        logger.LogDebug("Requesting temporary directory to write recipe to");

        var randomFileCommand = commonCommandGenerator.GenerateRandomFile();

        var result = await RunInContainer(
            logger,
            client,
            commonCommandGenerator,
            dockerContainerId,
            randomFileCommand
        );

        logger.LogDebug("Random file created: {File}", result.Result);

        var file = result.Result;

        var writer = new YamlRecipeWriter(recipe);
        var recipeContents = writer.WriteString();

        var writeCommand = commonCommandGenerator.WriteContentsToFile(recipeContents, file);

        var writeContainerResult = await RunInContainer(
            logger,
            client,
            commonCommandGenerator,
            dockerContainerId,
            writeCommand
        );

        return file;
    }

    protected async Task RunRecipe(
        ILogger<BaseDeploymentJob> logger,
        ICloudCrafterRemoteClient client,
        ICommonCommandGenerator commonCommandGenerator,
        string dockerContainerId,
        string recipePath
    )
    {
        logger.LogDebug("Running recipe");
        var recipeRunCommand = commonCommandGenerator.RunRecipe(recipePath);

        logger.LogDebug("Running command: {Command}", recipeRunCommand);

        var result = await RunInContainer(
            logger,
            client,
            commonCommandGenerator,
            dockerContainerId,
            recipeRunCommand
        );

        logger.LogDebug("Recipe executed with result: {Result}", result.Result);
    }
}
