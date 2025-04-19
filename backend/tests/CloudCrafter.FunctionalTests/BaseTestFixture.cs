using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;

namespace CloudCrafter.FunctionalTests;

using static Testing;

[TestFixture]
public abstract class BaseTestFixture
{
    [SetUp]
    public async Task TestSetUp()
    {
        await ResetState();
    }

    public async Task<Team> CreateTeam(Guid? ownerId = null)
    {
        var teamFaker = FakerInstances.TeamFaker();
        if (ownerId == null)
        {
            var user = FakerInstances.UserFaker.Generate();
            await AddAsync(user);
            teamFaker = teamFaker.RuleFor(x => x.OwnerId, user.Id);
        }
        else
        {
            teamFaker = teamFaker.RuleFor(x => x.OwnerId, ownerId.Value);
        }

        var team = teamFaker.Generate();
        await AddAsync(team);
        return team;
    }

    public async Task<Stack> CreateSampleStack(Action<Stack>? customizeStack = null)
    {
        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);

        var project = FakerInstances.ProjectFaker.Generate();
        await AddAsync(project);

        var environment = FakerInstances.EnvironmentFaker(project).Generate();
        await AddAsync(environment);

        var stackFaker = FakerInstances
            .StackFaker(environment.Id)
            .RuleFor(x => x.ServerId, server.Id)
            .RuleFor(x => x.Server, f => null);

        var stack = stackFaker.Generate();

        if (customizeStack != null)
        {
            customizeStack(stack);
        }

        await AddAsync(stack);

        return stack;
    }
}
