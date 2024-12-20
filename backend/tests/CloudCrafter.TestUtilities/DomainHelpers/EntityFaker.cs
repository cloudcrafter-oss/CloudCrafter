using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using Environment = System.Environment;

namespace CloudCrafter.TestUtilities.DomainHelpers;

public static class EntityFaker
{
    public static Stack GenerateBasicAppStack(GenerateBasicAppArgs args)
    {
        ApplicationSource? source = null;
        if (args.SourceProvider != null)
        {
            source = new ApplicationSource
            {
                Type = ApplicationSourceType.GithubApp,
                GithubApp = new ApplicationSourceGithubApp
                {
                    SourceProvider = args.SourceProvider,
                    SourceProviderId = args.SourceProvider.Id,
                    Path = "/",
                    Branch = "main",
                    Repository = "https://github.com/cloudcrafter-oss/ci-private-tests",
                    RepositoryId = "903683855",
                },
            };
        }
        else
        {
            source = new ApplicationSource
            {
                Type = ApplicationSourceType.Git,
                Git = new ApplicationSourceGit
                {
                    Repository = args.GitRepository,
                    Path = args.GitPath,
                },
            };
        }

        var stack = FakerInstances
            .StackFaker(args.EnvironmentId)
            .RuleFor(x => x.Id, args.StackId)
            .RuleFor(x => x.Source, source)
            .RuleFor(x => x.Name, args.StackName)
            .Generate();

        var stackService = FakerInstances
            .StackServiceFaker(stack)
            .RuleFor(x => x.Id, args.StackServiceId)
            .RuleFor(x => x.HealthcheckConfiguration, args.HealthcheckConfiguration)
            .RuleFor(
                x => x.HttpConfiguration,
                new EntityHttpConfiguration
                {
                    DomainName = args.DomainName,
                    ContainerHttpPort = args.ContainerHttpPort,
                }
            )
            .RuleFor(x => x.Name, args.StackServiceName)
            .Generate();

        stack.Services.Add(stackService);

        return stack;
    }

    public static Stack GenerateStackWithGithubApp(
        Guid environmentId,
        Guid stackId,
        Guid stackServiceId
    )
    {
        var sourceProvider = new SourceProvider
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Name = "Github OSS Test",
            GithubProviderId = Guid.NewGuid(),
        };

        var stack = GenerateBasicAppStack(
            new GenerateBasicAppArgs
            {
                DomainName = "my-custom-domain.com",
                EnvironmentId = environmentId,
                StackId = stackId,
                StackServiceId = stackServiceId,
                StackName = "My Custom Stack 123",
                StackServiceName = "My Custom Service : 123",
                SourceProvider = new SourceProvider
                {
                    Id = Guid.NewGuid(),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Name = "Github OSS Test",
                    GithubProviderId = Guid.NewGuid(),
                    GithubProvider = new GithubProvider
                    {
                        Id = Guid.NewGuid(),
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        InstallationId = 58413956,
                        AppName = "[CI TESTS] CloudCrafter-OSS",
                        AppId = long.Parse(
                            Environment.GetEnvironmentVariable("TESTS_GITHUB_APP_APP_ID") ?? "0"
                        ),
                        AppClientId = Environment.GetEnvironmentVariable(
                            "TESTS_GITHUB_APP_CLIENT_ID"
                        ),
                        AppClientSecret = Environment.GetEnvironmentVariable(
                            "TESTS_GITHUB_APP_CLIENT_SECRET"
                        ),
                        AppWebhookSecret = Environment.GetEnvironmentVariable(
                            "TESTS_GITHUB_APP_WEBHOOK_SECRET"
                        ),
                        AppUrl = Environment.GetEnvironmentVariable("TESTS_GITHUB_APP_URL"),
                        AppPrivateKey = Environment.GetEnvironmentVariable(
                            "TESTS_GITHUB_APP_PRIVATE_KEY"
                        ),
                        IsValid = true,
                        SourceProvider = sourceProvider,
                    },
                },
                HealthcheckConfiguration = new EntityHealthcheckConfiguration
                {
                    HttpHost = null,
                    HttpMethod = null,
                    HttpPath = null,
                    HttpPort = null,
                    HttpSchema = null,
                },
            }
        );

        return stack;
    }

    public class GenerateBasicAppArgs
    {
        public required Guid EnvironmentId { get; init; }
        public required Guid StackId { get; init; }
        public required Guid StackServiceId { get; init; }
        public required string StackName { get; init; }

        public required string DomainName { get; init; }

        public required string StackServiceName { get; init; }
        public required SourceProvider? SourceProvider { get; init; }

        public string GitRepository { get; init; } =
            "https://github.com/cloudcrafter-oss/demo-examples";

        public string GitPath { get; init; } = "nixpacks-node-server";

        public EntityHealthcheckConfiguration HealthcheckConfiguration { get; init; } =
            new()
            {
                HttpMethod = "GET",
                HttpSchema = "http",
                HttpHost = "127.0.0.1",
                HttpPort = 3000,
                HttpPath = "/",
                ExpectedHttpStatusCode = 200,
                MaxRetries = 3,
            };

        public int? ContainerHttpPort { get; set; }
    }
}
