using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks;

using static Testing;

public class GetStackDetailTest : BaseTestFixture
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new GetStackDetailQuery { StackId = Guid.NewGuid() })
        );
    }

    [Test]
    [Ignore("TODO: ACL check not yet implemented")]
    public async Task ShoulThrowErrorWhenNoAccessBecauseItDoesNotExists()
    {
        await RunAsAdministratorAsync();

        var deploymentId = Guid.NewGuid();
        var ex = Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new GetStackDetailQuery { StackId = Guid.NewGuid() })
        );

        ex.Message.Should().Be($"User does not have access to stack {deploymentId}");
    }

    [Test]
    public async Task ShouldReturnStack()
    {
        await RunAsAdministratorAsync();

        var team = await CreateTeam();
        var project = FakerInstances.ProjectFaker(team.Id).Generate();
        await AddAsync(project);

        var environment = FakerInstances.EnvironmentFaker(project).Generate();
        await AddAsync(environment);

        var stack = FakerInstances.StackFaker(environment.Id).Generate();
        await AddAsync(stack);

        var result = await SendAsync(new GetStackDetailQuery { StackId = stack.Id });

        result.Should().NotBeNull();
        result!.Id.Should().Be(stack.Id);
        result.Name.Should().Be(stack.Name);
    }
}
