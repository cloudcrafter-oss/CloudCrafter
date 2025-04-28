using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.EnvironmentVariables;

using static Testing;

public class CreateStackEnvironmentVariableGroupCommandTest : BaseEnvironmentVariablesTest
{
    private readonly CreateStackEnvironmentVariableGroupCommand Command =
        new()
        {
            StackId = Guid.NewGuid(),
            Name = "",
            Description = "",
        };

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToCreateEnvironmentVariableGroupBecauseUserHasNoPermissionToStack(
        bool addUserToTeam
    )
    {
        var userId = await RunAsDefaultUserAsync();
        var stack = await CreateSampleStack();

        if (addUserToTeam)
        {
            await AddToTeam(stack.Environment.Project.Team, userId);
        }

        Assert.ThrowsAsync<NotEnoughPermissionInTeamException>(
            async () =>
                await SendAsync(
                    Command with
                    {
                        StackId = stack.Id,
                        Name = "Test Group",
                        Description = "A test group for environment variables",
                    }
                )
        );
    }

    [Test]
    public async Task ShouldNotCreateEnvironmentVariableGroupBecauseValidation()
    {
        await RunAsAdministratorAsync();

        var exception = Assert.ThrowsAsync<ValidationException>(
            async () => await SendAsync(Command)
        );

        exception.Should().NotBeNull();
        exception!.Errors.Should().ContainKey("Name").And.HaveCount(1);
        exception!.Errors["Name"].Should().Contain("Group name is required");

        await AssertEnvGroupCount(0);
    }

    [Test]
    public async Task ShouldNotCreateEnvironmentVariableGroupBecauseStackDoesNotExists()
    {
        await RunAsAdministratorAsync();
        await AssertEnvGroupCount(0);

        Assert.ThrowsAsync<NotFoundException>(
            async () => await SendAsync(Command with { Name = "Test Group" })
        );

        await AssertEnvGroupCount(0);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToCreateEnvironmentVariableGroup(bool isAdmin)
    {
        await AssertEnvGroupCount(0);

        Guid? userId = null;

        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            userId = await RunAsDefaultUserAsync();
        }

        var stack = await CreateSampleStack(null, userId);

        var result = await SendAsync(
            Command with
            {
                StackId = stack.Id,
                Name = "Test Group",
                Description = "A test group for environment variables",
            }
        );

        await AssertEnvGroupCount(1);

        var entity = FetchEntity<StackEnvironmentVariableGroup>(x => x.Id == result);
        entity.Should().NotBeNull();
        entity!.Name.Should().Be("Test Group");
        entity!.Description.Should().Be("A test group for environment variables");
        entity.StackId.Should().Be(stack.Id);
    }

    [Test]
    public async Task ShouldNotBeAbleToCreateAnEnvironmentVariableGroupWithSameName()
    {
        await RunAsAdministratorAsync();
        await AssertEnvGroupCount(0);

        var stack = await CreateSampleStack();

        var group = new StackEnvironmentVariableGroup
        {
            Id = Guid.NewGuid(),
            StackId = stack.Id,
            Name = "MY_GROUP",
            Description = "Existing group",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await AddAsync(group);
        await AssertEnvGroupCount(1);

        var exception = Assert.ThrowsAsync<ValidationException>(
            async () =>
                await SendAsync(
                    Command with
                    {
                        StackId = stack.Id,
                        Name = "MY_GROUP",
                        Description = "Another group",
                    }
                )
        );

        exception.Should().NotBeNull();
        exception!.Errors.Should().ContainKey("EnvironmentVariableGroup").And.HaveCount(1);
        exception!
            .Errors["EnvironmentVariableGroup"]
            .Should()
            .Contain("Environment variable group name must be unique for this Stack");

        await AssertEnvGroupCount(1);
    }
}
