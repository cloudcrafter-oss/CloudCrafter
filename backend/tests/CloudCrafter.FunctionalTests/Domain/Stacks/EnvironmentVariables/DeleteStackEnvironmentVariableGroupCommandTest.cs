using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;

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

    [Test]
    public async Task ShouldSuccessfullyDeleteGroup()
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
