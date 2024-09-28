using CloudCrafter.Agent.Models.IO;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Core.Config;
using CloudCrafter.DeploymentEngine.Domain.Commands;
using CloudCrafter.DeploymentEngine.Remote.Clients.Contracts;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Stacks;

public abstract class BaseDeploymentJob
{
    protected ICloudCrafterRemoteClient? _client = null;
    private string? _helperContainerId;
    private string? _stopAndRemoveContainerCommand;

    protected async Task RemoveHelperImage()
    {
        if (string.IsNullOrEmpty(_helperContainerId))
        {
            return;
        }

        if (!string.IsNullOrEmpty(_stopAndRemoveContainerCommand) && _client != null)
        {
            await _client.ExecuteCommandAsync(_stopAndRemoveContainerCommand);
        }

        _client?.Dispose();
    }

    private void EnsureClientCreated(ILogger<BaseDeploymentJob> logger)
    {
        if (_client != null)
        {
            return;
        }

        logger.LogCritical("Client not initialized");
        throw new Exception("Client not initialized");
    }

    protected async Task PullHelperImage(
        ILogger<BaseDeploymentJob> logger,
        ICommonCommandGenerator commonCommandGenerator
    )
    {
        EnsureClientCreated(logger);
        logger.LogDebug("Pulling helper image");
        await _client!.ExecuteCommandAsync(
            commonCommandGenerator.PullDockerImage(DynamicConfig.HelperImage),
            true
        );

        var imageIdResult = await _client.ExecuteCommandAsync(
            commonCommandGenerator.VerifyDockerImageExists(DynamicConfig.HelperImage)
        );
        logger.LogDebug("Helper image pulled with ID: {ImageId}", imageIdResult.Result);
    }

    protected async Task<ExecutedCommandDetails> RunInContainer(
        ILogger<BaseDeploymentJob> logger,
        ICommonCommandGenerator commonCommandGenerator,
        string containerId,
        string command
    )
    {
        EnsureClientCreated(logger);
        logger.LogDebug(
            "Running command in container {ContainerId}: {Command}",
            containerId,
            command
        );
        var containerCommand = commonCommandGenerator.RunInDockerContainer(containerId, command);

        logger.LogDebug("Running command: {Command}", containerCommand);

        var result = await _client!.ExecuteCommandAsync(containerCommand);

        logger.LogDebug("Command executed with result: {Result}", result.Result);

        return result;
    }

    protected async Task CreateDockerContainer(
        ILogger<BaseDeploymentJob> logger,
        ICommonCommandGenerator commonCommandGenerator,
        string dockerDataDirOnHost,
        Guid deploymentId
    )
    {
        EnsureClientCreated(logger);
        if (!string.IsNullOrEmpty(_helperContainerId))
        {
            return;
        }

        logger.LogDebug("Creating Agent-container for deployment");

        var dataDir = DynamicConfig.DataDirInContainer;
        var command = commonCommandGenerator.CreateHelperContainer(
            deploymentId,
            DynamicConfig.HelperImage,
            [(dockerDataDirOnHost, dataDir)]
        );

        var result = await _client!.ExecuteCommandAsync(command);
        logger.LogDebug("Agent-container created with ID: {ContainerId}", result.Result);

        _helperContainerId = result.Result;

        _stopAndRemoveContainerCommand = commonCommandGenerator.StopAndRemoveContainer(
            _helperContainerId
        );
    }

    protected async Task<string> WriteRecipeToFile(
        ILogger<BaseDeploymentJob> logger,
        ICommonCommandGenerator commonCommandGenerator,
        DeploymentRecipe recipe
    )
    {
        EnsureClientCreated(logger);
        if (string.IsNullOrEmpty(_helperContainerId))
        {
            logger.LogCritical("Helper container not created");
            throw new Exception("Helper container not created");
        }

        logger.LogDebug("Requesting temporary directory to write recipe to");

        var randomFileCommand = commonCommandGenerator.GenerateRandomFile();

        var result = await RunInContainer(
            logger,
            commonCommandGenerator,
            _helperContainerId,
            randomFileCommand
        );

        logger.LogDebug("Random file created: {File}", result.Result);

        var file = result.Result;

        var writer = new YamlRecipeWriter(recipe);
        var recipeContents = writer.WriteString();

        var writeCommand = commonCommandGenerator.WriteContentsToFile(recipeContents, file);

        var writeContainerResult = await RunInContainer(
            logger,
            commonCommandGenerator,
            _helperContainerId,
            writeCommand
        );

        return file;
    }

    protected async Task RunRecipe(
        ILogger<BaseDeploymentJob> logger,
        ICommonCommandGenerator commonCommandGenerator,
        string recipePath
    )
    {
        EnsureClientCreated(logger);
        if (string.IsNullOrEmpty(_helperContainerId))
        {
            logger.LogCritical("Helper container not created");
            throw new Exception("Helper container not created");
        }

        logger.LogDebug("Running recipe");
        var recipeRunCommand = commonCommandGenerator.RunRecipe(recipePath);

        logger.LogDebug("Running command: {Command}", recipeRunCommand);

        var result = await RunInContainer(
            logger,
            commonCommandGenerator,
            _helperContainerId,
            recipeRunCommand
        );

        logger.LogDebug("Recipe executed with result: {Result}", result.Result);
    }
}
