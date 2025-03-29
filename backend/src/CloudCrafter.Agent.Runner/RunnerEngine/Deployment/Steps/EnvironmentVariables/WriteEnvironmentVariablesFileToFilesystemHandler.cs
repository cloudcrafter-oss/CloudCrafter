using CloudCrafter.Agent.Models.Deployment.Steps.Params.EnvironmentFiles;
using CloudCrafter.Agent.Models.Exceptions;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Cli.Helpers.Abstraction;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.Factories;
using CloudCrafter.Agent.Runner.Validators.EnvironmentVariables;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps.EnvironmentVariables;

public class WriteEnvironmentVariablesFileToFilesystemHandler(
    IMessagePump pump,
    IFileSystemHelper fileSystemHelper
) : BaseDeploymentStep<WriteEnvironmentVariablesFileToFilesystemParams>
{
    private readonly IDeploymentLogger _logger =
        pump.CreateLogger<WriteEnvironmentVariablesFileToFilesystemHandler>();
    public override DeploymentBuildStepType Type =>
        DeploymentBuildStepType.WriteEnvironmentVariablesFileToFilesystem;

    public override IValidator<WriteEnvironmentVariablesFileToFilesystemParams> Validator =>
        new WriteEnvironmentVariablesFileToFilesystemParamsValidator();

    public override Task DryRun(
        WriteEnvironmentVariablesFileToFilesystemParams parameters,
        DeploymentContext context
    )
    {
        _logger.LogInfo("Start dry run for WriteEnvironmentVariablesFileToFilesystemHandler");

        return Task.CompletedTask;
    }

    public override async Task ExecuteAsync(
        WriteEnvironmentVariablesFileToFilesystemParams parameters,
        DeploymentContext context
    )
    {
        _logger.LogInfo("Writing environment variables to filesystem");

        if (string.IsNullOrWhiteSpace(context.Recipe.DockerComposeOptions?.DockerComposeDirectory))
        {
            throw new DeploymentException(
                "Docker compose directory not found - cannot write environment variable file."
            );
        }

        await fileSystemHelper.EnsureDirectoryExists(
            context.Recipe.DockerComposeOptions.DockerComposeDirectory
        );

        var fullPath =
            $"{context.Recipe.DockerComposeOptions.DockerComposeDirectory}/{parameters.FileName}";

        await fileSystemHelper.WriteFile(fullPath, parameters.FileContents);
        _logger.LogInfo($"Successfully wrote environment variables to {fullPath}");
    }
}
