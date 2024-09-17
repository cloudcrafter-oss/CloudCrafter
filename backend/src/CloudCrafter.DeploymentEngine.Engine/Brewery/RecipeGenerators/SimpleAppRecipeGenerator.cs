using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.DeploymentEngine.Engine.Brewery.DockerCompose;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using CloudCrafter.DockerCompose.Engine.Yaml;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.RecipeGenerators;

public class SimpleAppRecipeGenerator(BaseRecipeGenerator.Args options)
    : BaseRecipeGenerator(options)
{
    public override BaseDockerComposeGenerator CreateDockerComposeGenerator()
    {
        return new SimpleAppDockerComposeGenerator(
            new BaseDockerComposeGenerator.Args
            {
                Stack = Options.Stack,
                DeploymentId = Options.DeploymentId,
            }
        );
    }

    public override DeploymentRecipe Generate()
    {
        var dockerComposeEditor = GenerateDockerCompose();

        // TODO: Move to some constant (and in the future a configurable option.
        // For now, it's fine.
        var dockerComposeLocation = $"/data/cloudcrafter/stacks/{Options.Stack.Id}";
        Recipe
            .SetDockerComposeOptions(dockerComposeEditor, dockerComposeLocation)
            .SetDestination(dockerComposeLocation);

        AddSteps(dockerComposeEditor);

        return Recipe.Build();
    }

    private void AddSteps(DockerComposeEditor dockerComposeEditor)
    {
        AddNetworkExistsStep("cloudcrafter");

        if (!string.IsNullOrWhiteSpace(Options.Stack.Source?.Git?.Repository))
        {
            // TODO: It should never be possible that it is null or empty in this case.
            // Maybe we should throw an exception if it happens.
            AddFetchGitRepositoryStep(
                Options.Stack.Source.Git.Repository,
                "HEAD" // TODO: change
            );
        }

        var firstService = Options.Stack.Services.First();

        var dockerComposeServices = dockerComposeEditor.Services();
        if (dockerComposeServices.Count() > 1)
        {
            throw new InvalidOperationException(
                "SimpleAppRecipeGenerator can only be used with stacks that have exactly 1 service defined in the docker-compose.yml file, found following services: "
                    + string.Join(", ", dockerComposeServices)
            );
        }

        var dockerComposeFileName = "docker-compose.yml";

        AddDetermineBuildpackStep(Options.Stack.Source?.Git?.Path);
        AddGenerateBuildPlan(Options.Stack.Source?.Git?.Path);
        AlterNixpacksPlan(["iputils-ping", "curl"]);
        AddWritePlanToFilesystemStep(Options.Stack.Source?.Git?.Path);
        AddBuildNixpacksDockerImageStep(
            firstService.Id.ToString(),
            "latest",
            Options.Stack.Source?.Git?.Path
        );
        AddWriteDockerComposeFileStep(dockerComposeFileName);
        AddStartDockerComposeStep(dockerComposeFileName);

        var healthCheckConfiguration = firstService.HealthcheckConfiguration;
        var hasValidHealthConfiguration = healthCheckConfiguration.ConfigurationValid();

        var healthCheckOptionForAppService =
            new ContainerHealthCheckDeploymentStepGenerator.ArgsHealthCheckSettings
            {
                HttpHost = hasValidHealthConfiguration ? healthCheckConfiguration.HttpHost : null,
                HttpMethod = hasValidHealthConfiguration
                    ? healthCheckConfiguration.HttpMethod
                    : null,
                HttpPath = hasValidHealthConfiguration ? healthCheckConfiguration.HttpPath : null,
                HttpPort = hasValidHealthConfiguration ? healthCheckConfiguration.HttpPort : null,
                HttpSchema = hasValidHealthConfiguration
                    ? healthCheckConfiguration.HttpSchema
                    : null,
                ExpectedHttpStatusCode = hasValidHealthConfiguration
                    ? healthCheckConfiguration.ExpectedHttpStatusCode
                    : null,
                MaxRetries = hasValidHealthConfiguration
                    ? healthCheckConfiguration.MaxRetries
                    : null,
                CheckForDockerHealth =
                    healthCheckConfiguration.UseDockerHealthCheck.GetValueOrDefault(),
            };

        if (
            hasValidHealthConfiguration
            || healthCheckConfiguration.UseDockerHealthCheck.GetValueOrDefault()
        )
        {
            // Only add health check when it is configured or when the docker health check is enabled.
            AddCheckContainerHealthCheckStep(
                new ContainerHealthCheckDeploymentStepGenerator.Args
                {
                    DockerComposeSettings =
                        new ContainerHealthCheckDeploymentStepGenerator.ArgsComposeSettings
                        {
                            FetchServicesFromContext = true,
                        },
                    Services = new Dictionary<
                        string,
                        ContainerHealthCheckDeploymentStepGenerator.ArgsHealthCheckSettings
                    >
                    {
                        { dockerComposeServices.First(), healthCheckOptionForAppService },
                    },
                }
            );
        }
    }
}
