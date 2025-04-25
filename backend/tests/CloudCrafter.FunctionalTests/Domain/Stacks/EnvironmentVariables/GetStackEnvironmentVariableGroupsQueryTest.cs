using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.EnvironmentVariables;

using static Testing;

public class GetStackEnvironmentVariableGroupsQueryTest : BaseEnvironmentVariablesTest
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new GetStackEnvironmentVariableGroupsQuery(Guid.NewGuid()))
        );
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldThrowExceptionWhenStackIdDoesNotExists(bool isAdmin)
    {
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            await RunAsDefaultUserAsync();
        }

        Assert.ThrowsAsync<NotFoundException>(
            async () => await SendAsync(new GetStackEnvironmentVariableGroupsQuery(Guid.NewGuid()))
        );
    }

    [Test]
    public async Task ShouldNotBeAbleToGetGroupsBecauseUserNotPartOfTeam()
    {
        await RunAsDefaultUserAsync();
        var stack = await CreateSampleStack();

        Assert.ThrowsAsync<CannotAccessTeamException>(
            async () => await SendAsync(new GetStackEnvironmentVariableGroupsQuery(stack.Id))
        );
    }

    [TestCase(true, false, false)]
    [TestCase(false, true, true)]
    [TestCase(false, false, true)]
    [TestCase(false, true, false)]
    public async Task ShouldReceiveEmptyListWhenNoGroupsExists(
        bool isAdmin,
        bool isMember,
        bool isTeamOwner
    )
    {
        await AssertEnvGroupCount(0);
        Guid? ownerId = null;
        Guid? userId = null;

        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            userId = await RunAsDefaultUserAsync();
            if (isTeamOwner)
            {
                ownerId = userId;
            }
        }

        var stack = await CreateSampleStack(null, ownerId);

        if (isMember)
        {
            await AddToTeam(stack.Environment.Project.Team, userId);
        }

        var result = await SendAsync(new GetStackEnvironmentVariableGroupsQuery(stack.Id));

        result.Count.Should().Be(0);
        await AssertEnvGroupCount(0);
    }

    [TestCase(true, false, false)]
    [TestCase(false, true, true)]
    [TestCase(false, false, true)]
    [TestCase(false, true, false)]
    public async Task ShouldReceiveGroupsWhenGroupsExists(
        bool isAdmin,
        bool isMember,
        bool isTeamOwner
    )
    {
        await AssertEnvGroupCount(0);
        Guid? ownerId = null;
        Guid? userId = null;

        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            userId = await RunAsDefaultUserAsync();
            if (isTeamOwner)
            {
                ownerId = userId;
            }
        }

        var stack = await CreateSampleStack(null, ownerId);

        if (isMember)
        {
            await AddToTeam(stack.Environment.Project.Team, userId);
        }

        var group1 = FakerInstances.StackEnvironmentVariableGroupFaker(stack).Generate();

        await AddAsync(group1);

        var group2 = FakerInstances.StackEnvironmentVariableGroupFaker(stack).Generate();

        await AddAsync(group2);

        var result = await SendAsync(new GetStackEnvironmentVariableGroupsQuery(stack.Id));

        result.Count.Should().Be(2);
        await AssertEnvGroupCount(2);
    }
}
