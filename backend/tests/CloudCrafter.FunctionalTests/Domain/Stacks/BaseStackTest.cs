using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;

namespace CloudCrafter.FunctionalTests.Domain.Stacks;

using static Testing;

public abstract class BaseStackTest : BaseTestFixture
{
    public const string DemoRepo = "https://github.com/cloudcrafter-oss/demo-examples";
    public const string DemoBranch = "main";
    public const string DemoPostgresPath = "docker-compose-examples/postgresql-server";

    public async Task<Stack> CreateStack(Guid teamId, string repository, string branch, string path)
    {
        var project = FakerInstances.ProjectFaker(teamId).Generate();
        await AddAsync(project);

        var environment = FakerInstances.EnvironmentFaker(project).Generate();
        await AddAsync(environment);

        var stack = FakerInstances
            .StackFaker(
                environment.Id,
                new FakerInstances.PublicGitSettings(repository, branch, path)
            )
            .Generate();
        await AddAsync(stack);

        return stack;
    }
}
