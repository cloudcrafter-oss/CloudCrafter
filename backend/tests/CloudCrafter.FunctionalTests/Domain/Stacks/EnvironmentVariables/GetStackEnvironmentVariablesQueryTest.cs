using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.EnvironmentVariables;

using static Testing;

public class GetStackEnvironmentVariablesQueryTest : BaseEnvironmentVariablesTest
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new GetStackEnvironmentVariablesQuery(Guid.NewGuid()))
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
            async () => await SendAsync(new GetStackEnvironmentVariablesQuery(Guid.NewGuid()))
        );
    }

    [Test]
    public async Task ShouldNotBeAbleToGetVariablesBecauseUserNotPartOfTeam()
    {
        await RunAsDefaultUserAsync();
        var stack = await CreateSampleStack();

        Assert.ThrowsAsync<CannotAccessTeamException>(
            async () => await SendAsync(new GetStackEnvironmentVariablesQuery(stack.Id))
        );
    }

    [TestCase(true, false, false)]
    [TestCase(false, true, true)]
    [TestCase(false, false, true)]
    [TestCase(false, true, false)]
    public async Task ShouldGetEmptyListWhenNoEnvironmentVariablesExists(
        bool isAdmin,
        bool isMember,
        bool isTeamOwner
    )
    {
        await AssertEnvCount(0);
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

        var result = await SendAsync(new GetStackEnvironmentVariablesQuery(stack.Id));

        result.Count.Should().Be(0);
        await AssertEnvCount(0);
    }

    [TestCase(true, false, false)]
    [TestCase(false, true, true)]
    [TestCase(false, false, true)]
    [TestCase(false, true, false)]
    public async Task ShouldGetGroupedAndNonGroupedEnvironmentVariables(
        bool isAdmin,
        bool isMember,
        bool isTeamOwner
    )
    {
        await AssertEnvCount(0);
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

        var group = FakerInstances.StackEnvironmentVariableGroupFaker(stack).Generate();
        await AddAsync(group);

        var groupedEnvironmentVariable = FakerInstances
            .StackEnvironmentVariableFaker(stack)
            .RuleFor(x => x.GroupId, f => group.Id)
            .RuleFor(x => x.Key, f => "MY_GROUPED_KEY")
            .Generate();
        await AddAsync(groupedEnvironmentVariable);

        var nonGroupedEnvironmentVariable = FakerInstances
            .StackEnvironmentVariableFaker(stack)
            .RuleFor(x => x.Key, f => "MY_NON_GROUPED_KEY")
            .Generate();
        await AddAsync(nonGroupedEnvironmentVariable);

        await AssertEnvCount(2);
        await AssertEnvGroupCount(1);

        var result = await SendAsync(new GetStackEnvironmentVariablesQuery(stack.Id));

        result.Count.Should().Be(2);

        var groupedEnvVar = result.FirstOrDefault(x => x.Key == groupedEnvironmentVariable.Key);
        groupedEnvVar.Should().NotBeNull();
        groupedEnvVar!.GroupId.Should().Be(group.Id);
        groupedEnvVar.Value.Should().Be(groupedEnvironmentVariable.Value);
        groupedEnvVar.GroupName.Should().Be(group.Name);

        var nonGroupedEnvVar = result.FirstOrDefault(x =>
            x.Key == nonGroupedEnvironmentVariable.Key
        );
        nonGroupedEnvVar.Should().NotBeNull();
        nonGroupedEnvVar!.GroupId.Should().BeNull();
        nonGroupedEnvVar.Value.Should().Be(nonGroupedEnvironmentVariable.Value);
        nonGroupedEnvVar.GroupName.Should().BeNull();
    }

    [TestCase("MY_VALUE", "MY_VALUE", true)]
    [TestCase("MY_VALUE", "[MASKED]", false)]
    public async Task ShouldBeAbleToSeeSecretWhenPassingRevealSecrets(
        string input,
        string expected,
        bool includeSecrets
    )
    {
        await RunAsAdministratorAsync();

        await AssertEnvCount(0);
        await AssertEnvGroupCount(0);

        var stack = await CreateSampleStack();

        var secretVariable = FakerInstances
            .StackEnvironmentVariableFaker(stack)
            .RuleFor(x => x.Key, f => "MY_SECRET")
            .RuleFor(x => x.Value, input)
            .RuleFor(x => x.IsSecret, true)
            .Generate();
        await AddAsync(secretVariable);

        var result = await SendAsync(
            new GetStackEnvironmentVariablesQuery(stack.Id, includeSecrets)
        );

        result.Count.Should().Be(1);

        var firstItem = result.FirstOrDefault();
        firstItem.Should().NotBeNull();
        firstItem!.IsSecret.Should().Be(true);
        firstItem.Value.Should().Be(expected);
    }
}
