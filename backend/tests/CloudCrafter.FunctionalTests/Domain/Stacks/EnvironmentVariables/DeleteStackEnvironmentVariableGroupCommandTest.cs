using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.EnvironmentVariables;

using static Testing;

public class DeleteStackEnvironmentVariableGroupCommandTest : BaseEnvironmentVariablesTest
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () =>
                await SendAsync(
                    new DeleteStackEnvironmentVariableGroupCommand(Guid.NewGuid(), Guid.NewGuid())
                )
        );
    }

    [Test]
    public async Task ShouldThrowExceptionWhenStackIdDoesNotExists()
    {
        await RunAsAdministratorAsync();

        await AssertEnvGroupCount(0);
        Assert.ThrowsAsync<NotFoundException>(
            async () =>
                await SendAsync(
                    new DeleteStackEnvironmentVariableGroupCommand(Guid.NewGuid(), Guid.NewGuid())
                )
        );
    }

    [Test]
    public async Task ShouldThrowExceptionWhenGroupIdDoesNotExist()
    {
        await RunAsAdministratorAsync();
        await AssertEnvGroupCount(0);

        // Create stack
        var stack = await CreateSampleStack();

        // Attempt to delete non-existent group
        Assert.ThrowsAsync<NotFoundException>(
            async () =>
                await SendAsync(
                    new DeleteStackEnvironmentVariableGroupCommand(stack.Id, Guid.NewGuid())
                )
        );
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToDeleteStackIfNotTeamOwner(bool attachToTeam)
    {
        var userId = await RunAsDefaultUserAsync();

        var stack = await CreateSampleStack();

        if (attachToTeam)
        {
            await AddToTeam(stack.Environment.Project.Team, userId);
        }

        var group = new StackEnvironmentVariableGroup
        {
            Id = Guid.NewGuid(),
            StackId = stack.Id,
            Name = "Test Group",
            Description = "A test group for deletion",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await AddAsync(group);
        await AssertEnvGroupCount(1);

        Assert.ThrowsAsync<NotEnoughPermissionInTeamException>(
            async () =>
                await SendAsync(new DeleteStackEnvironmentVariableGroupCommand(stack.Id, group.Id))
        );

        await AssertEnvGroupCount(1);
    }

    [TestCase(true, false)]
    [TestCase(false, true)]
    public async Task ShouldSuccessfullyDeleteGroup(bool isAdmin, bool isTeamOwner)
    {
        await AssertEnvGroupCount(0);

        Guid? ownerId = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            var userId = await RunAsDefaultUserAsync();

            if (isTeamOwner)
            {
                ownerId = userId;
            }
        }

        // Create stack
        var stack = await CreateSampleStack(null, ownerId);

        // Create group
        var group = new StackEnvironmentVariableGroup
        {
            Id = Guid.NewGuid(),
            StackId = stack.Id,
            Name = "Test Group",
            Description = "A test group for deletion",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await AddAsync(group);
        await AssertEnvGroupCount(1);

        // Delete group
        await SendAsync(new DeleteStackEnvironmentVariableGroupCommand(stack.Id, group.Id));

        // Verify the deletion
        await AssertEnvGroupCount(0);

        // Make sure the group is no longer in the database
        var entity = FetchEntity<StackEnvironmentVariableGroup>(x => x.Id == group.Id);
        entity.Should().BeNull();
    }

    [Test]
    public async Task ShouldUngroupVariablesWhenDeletingGroup()
    {
        await RunAsAdministratorAsync();
        await AssertEnvGroupCount(0);

        // Create stack
        var stack = await CreateSampleStack();

        // Create group
        var group = new StackEnvironmentVariableGroup
        {
            Id = Guid.NewGuid(),
            StackId = stack.Id,
            Name = "Test Group",
            Description = "A test group for deletion",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await AddAsync(group);
        await AssertEnvGroupCount(1);

        // Create variables in the group
        var variable1 = new StackEnvironmentVariable
        {
            Id = Guid.NewGuid(),
            StackId = stack.Id,
            GroupId = group.Id,
            Key = "TEST_VAR_1",
            Value = "Value 1",
            IsSecret = false,
            Type = EnvironmentVariableType.Both,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        var variable2 = new StackEnvironmentVariable
        {
            Id = Guid.NewGuid(),
            StackId = stack.Id,
            GroupId = group.Id,
            Key = "TEST_VAR_2",
            Value = "Value 2",
            IsSecret = false,
            Type = EnvironmentVariableType.Both,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await AddAsync(variable1);
        await AddAsync(variable2);

        // Delete group
        await SendAsync(new DeleteStackEnvironmentVariableGroupCommand(stack.Id, group.Id));

        // Verify the deletion
        await AssertEnvGroupCount(0);

        // Verify variables still exist but are ungrouped
        var updatedVar1 = FetchEntity<StackEnvironmentVariable>(x => x.Id == variable1.Id);
        var updatedVar2 = FetchEntity<StackEnvironmentVariable>(x => x.Id == variable2.Id);

        updatedVar1.Should().NotBeNull();
        updatedVar2.Should().NotBeNull();

        updatedVar1!.GroupId.Should().BeNull();
        updatedVar2!.GroupId.Should().BeNull();
    }
}
