using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

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

    [Test]
    public async Task ShouldThrowExceptionWhenStackIdDoesNotExists()
    {
        await RunAsAdministratorAsync();

        Assert.ThrowsAsync<NotFoundException>(
            async () => await SendAsync(new GetStackEnvironmentVariableGroupsQuery(Guid.NewGuid()))
        );
    }

    [Test]
    public async Task ShouldReceiveEmptyListWhenNoGroupsExists()
    {
        await RunAsAdministratorAsync();
        await AssertEnvGroupCount(0);

        var stack = await CreateSampleStack();

        var result = await SendAsync(new GetStackEnvironmentVariableGroupsQuery(stack.Id));

        result.Count.Should().Be(0);
        await AssertEnvGroupCount(0);
    }

    [Test]
    public async Task ShouldReceiveGroupsWhenGroupsExists()
    {
        await RunAsAdministratorAsync();
        await AssertEnvGroupCount(0);

        var stack = await CreateSampleStack();

        var group1 = FakerInstances.StackEnvironmentVariableGroupFaker(stack).Generate();

        await AddAsync(group1);

        var group2 = FakerInstances.StackEnvironmentVariableGroupFaker(stack).Generate();

        await AddAsync(group2);

        var result = await SendAsync(new GetStackEnvironmentVariableGroupsQuery(stack.Id));

        result.Count.Should().Be(2);
        await AssertEnvGroupCount(2);
    }
}
