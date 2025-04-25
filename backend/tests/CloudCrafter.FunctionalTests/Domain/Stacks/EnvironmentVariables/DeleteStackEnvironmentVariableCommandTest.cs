using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.EnvironmentVariables;

using static Testing;

public class DeleteStackEnvironmentVariableCommandTest : BaseEnvironmentVariablesTest
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () =>
                await SendAsync(
                    new DeleteStackEnvironmentVariableCommand(Guid.NewGuid(), Guid.NewGuid())
                )
        );
    }

    [Test]
    public async Task ShouldThrowExceptionWhenStackDoesNotExist()
    {
        await RunAsAdministratorAsync();
        await AssertEnvCount(0);

        Assert.ThrowsAsync<NotFoundException>(
            async () =>
                await SendAsync(
                    new DeleteStackEnvironmentVariableCommand(Guid.NewGuid(), Guid.NewGuid())
                )
        );

        await AssertEnvCount(0);
    }

    [Test]
    public async Task ShouldThrowExceptionWhenEnvironmentVariableDoesNotExist()
    {
        await RunAsAdministratorAsync();
        await AssertEnvCount(0);

        // Create stack
        var stack = await CreateSampleStack();

        // Attempt to delete non-existent variable
        Assert.ThrowsAsync<NotFoundException>(
            async () =>
                await SendAsync(new DeleteStackEnvironmentVariableCommand(stack.Id, Guid.NewGuid()))
        );

        await AssertEnvCount(0);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToDeleteVariableBecauseUserIsNotOwnerOfTeam(bool addUserToTeam)
    {
        var userId = await RunAsDefaultUserAsync();

        var stack = await CreateSampleStack();

        if (addUserToTeam)
        {
            await AddToTeam(stack.Environment.Project.Team, userId);
        }

        // Create environment variable to delete
        var envVar = new StackEnvironmentVariable
        {
            Id = Guid.NewGuid(),
            StackId = stack.Id,
            Key = "TEST_DELETE_VAR",
            Value = "Value to delete",
            IsSecret = false,
            Type = EnvironmentVariableType.Both,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await AddAsync(envVar);
        await AssertEnvCount(1);

        Assert.ThrowsAsync<NotEnoughPermissionInTeamException>(
            async () =>
                await SendAsync(new DeleteStackEnvironmentVariableCommand(stack.Id, envVar.Id))
        );
    }

    [TestCase(true, false)]
    [TestCase(true, true)]
    public async Task ShouldDeleteEnvironmentVariableSuccessfully(bool isAdmin, bool isTeamOwner)
    {
        await AssertEnvCount(0);

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

        // Create environment variable to delete
        var envVar = new StackEnvironmentVariable
        {
            Id = Guid.NewGuid(),
            StackId = stack.Id,
            Key = "TEST_DELETE_VAR",
            Value = "Value to delete",
            IsSecret = false,
            Type = EnvironmentVariableType.Both,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await AddAsync(envVar);
        await AssertEnvCount(1);

        // Delete the variable
        await SendAsync(new DeleteStackEnvironmentVariableCommand(stack.Id, envVar.Id));

        // Verify deletion was successful
        await AssertEnvCount(0);

        // Verify the variable no longer exists in the database
        var deletedVar = FetchEntity<StackEnvironmentVariable>(x => x.Id == envVar.Id);
        deletedVar.Should().BeNull();
    }

    [TestCase(true, false)]
    [TestCase(false, true)]
    public async Task ShouldDeleteEnvironmentVariableInAGroup(bool isAdmin, bool isTeamOwner)
    {
        await AssertEnvCount(0);
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

        // Create a group
        var group = new StackEnvironmentVariableGroup
        {
            Id = Guid.NewGuid(),
            StackId = stack.Id,
            Name = "Test Group",
            Description = "Group for testing variable deletion",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await AddAsync(group);
        await AssertEnvGroupCount(1);

        // Create environment variable in the group
        var envVar = new StackEnvironmentVariable
        {
            Id = Guid.NewGuid(),
            StackId = stack.Id,
            GroupId = group.Id,
            Key = "GROUPED_VAR_TO_DELETE",
            Value = "Value in group",
            IsSecret = false,
            Type = EnvironmentVariableType.Runtime,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await AddAsync(envVar);
        await AssertEnvCount(1);

        // Delete the variable
        await SendAsync(new DeleteStackEnvironmentVariableCommand(stack.Id, envVar.Id));

        // Verify deletion was successful
        await AssertEnvCount(0);

        // Variable should be gone, but group should remain
        var deletedVar = FetchEntity<StackEnvironmentVariable>(x => x.Id == envVar.Id);
        deletedVar.Should().BeNull();

        // Verify the group still exists
        var existingGroup = FetchEntity<StackEnvironmentVariableGroup>(x => x.Id == group.Id);
        existingGroup.Should().NotBeNull();
        await AssertEnvGroupCount(1);
    }
}
