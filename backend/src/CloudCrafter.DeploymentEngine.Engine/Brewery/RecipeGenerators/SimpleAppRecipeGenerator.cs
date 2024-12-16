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

    public override async Task<GeneratedResult> Generate()
    {
        var dockerComposeEditor = GenerateDockerCompose();

        var isValid = await dockerComposeEditor.IsValid();

        if (!isValid.IsValid)
        {
            throw new InvalidOperationException(
                $"Generated docker-compose.yml is not valid, error: {isValid.ErrorMessage}"
            );
        }

        // TODO: Move to some constant (and in the future a configurable option.
        // For now, it's fine.
        var dockerComposeLocation = $"/data/cloudcrafter/stacks/{Options.Stack.Id}";
        var gitCheckoutDirectory = $"/data/git/cc-{Options.DeploymentId}";
        Recipe
            .SetDockerComposeOptions(dockerComposeEditor, dockerComposeLocation)
            .SetDestination(dockerComposeLocation, gitCheckoutDirectory);

        await AddSteps(dockerComposeEditor);

        var recipe = Recipe.Build();

        return new GeneratedResult
        {
            Recipe = recipe,
            DockerComposeYaml = dockerComposeEditor.GetYaml(),
        };
    }

    private async Task AddSteps(DockerComposeEditor dockerComposeEditor)
    {
        AddNetworkExistsStep("cloudcrafter");

        var isPublicApp = !string.IsNullOrWhiteSpace(Options.Stack.Source?.Git?.Repository);
        var isGithubApp = Options.Stack.Source?.GithubApp != null;

        if (!isPublicApp && !isGithubApp)
        {
            throw new InvalidOperationException(
                "SimpleAppRecipeGenerator can only be used with stacks that have a public git repository and a github app configured."
            );
        }

        if (isPublicApp)
        {
            AddFetchGitRepositoryStep(
                Options.Stack.Source!.Git!.Repository,
                "HEAD" // TODO: change
            );
        }

        if (isGithubApp)
        {
            var token = await Options.ProviderHelperProvider.GetProviderAccessTokenAsync(
                Options.Stack.Source!.GithubApp!.SourceProvider
            );

            var dto = await Options.ProviderHelperProvider.GetSourceLocation(
                Options.Stack.Source!.GithubApp!.SourceProvider,
                Options.Stack.Source!
            );
            AddFetchGitRepositoryFromGithubAppStep(Options.Stack.Source!.GithubApp!, token, dto);
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

        // TODO: Check for allowing rolling restart
        AddStopPreviousContainers(Options.Stack.Id, Options.DeploymentId);

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
