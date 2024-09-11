using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery;

public static class Helper
{
    public static Stack GenerateBasicAppStack(GenerateBasicAppArgs args)
    {
        var stack = FakerInstances
            .StackFaker(args.EnvironmentId)
            .RuleFor(x => x.Id, args.StackId)
            .RuleFor(
                x => x.Source,
                new ApplicationSource
                {
                    Type = ApplicationSourceType.Git,
                    Git = new ApplicationSourceGit
                    {
                        Repository = args.GitRepository,
                        Path = args.GitPath,
                    },
                }
            )
            .RuleFor(x => x.Name, args.StackName)
            .Generate();

        var stackService = FakerInstances
            .StackServiceFaker(stack)
            .RuleFor(x => x.Id, args.StackServiceId)
            .RuleFor(x => x.HealthcheckConfiguration, args.HealthcheckConfiguration)
            .RuleFor(
                x => x.HttpConfiguration,
                new EntityHttpConfiguration { DomainName = args.DomainName }
            )
            .RuleFor(x => x.Name, args.StackServiceName)
            .Generate();

        stack.Services.Add(stackService);

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
    }
}
