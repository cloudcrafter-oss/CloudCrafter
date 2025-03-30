using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.EnvironmentVariables;

using static Testing;

public class UpdateStackEnvironmentVariableGroupCommandTest : BaseEnvironmentVariablesTest
{
    private readonly UpdateStackEnvironmentVariableGroupCommand Command =
        new()
        {
            Id = Guid.NewGuid(),
            StackId = Guid.NewGuid(),
            Name = "",
            Description = "",
        };

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [Test]
    public async Task ShouldThrowExceptionWhenStackDoesNotExist()
    {
        await RunAsAdministratorAsync();
        await AssertEnvGroupCount(0);

        Assert.ThrowsAsync<NotFoundException>(
            async () => await SendAsync(Command with { Name = "Updated Group" })
        );

        await AssertEnvGroupCount(0);
    }

    [Test]
    public async Task ShouldThrowExceptionWhenGroupDoesNotExist()
    {
        await RunAsAdministratorAsync();
        await AssertEnvGroupCount(0);

        // Create stack
        var stack = await CreateSampleStack();

        // Attempt to update non-existent group
        Assert.ThrowsAsync<NotFoundException>(
            async () =>
                await SendAsync(
                    Command with
                    {
                        Id = Guid.NewGuid(),
                        StackId = stack.Id,
                        Name = "Updated Group",
                    }
                )
        );
    }

    [Test]
    public async Task ShouldSuccessfullyUpdateEnvironmentVariableGroup()
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
            Name = "Original Group",
            Description = "Original description",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await AddAsync(group);
        await AssertEnvGroupCount(1);

        // Update the group
        await SendAsync(
            Command with
            {
                Id = group.Id,
                StackId = stack.Id,
                Name = "Updated Group",
                Description = "Updated description",
            }
        );

        // Verify the update
        var updatedGroup = FetchEntity<StackEnvironmentVariableGroup>(x => x.Id == group.Id);
        updatedGroup.Should().NotBeNull();
        updatedGroup!.Name.Should().Be("Updated Group");
        updatedGroup!.Description.Should().Be("Updated description");
        updatedGroup.UpdatedAt.Should().BeAfter(group.UpdatedAt);
    }

    [Test]
    public async Task ShouldNotUpdateWhenNameConflictsWithAnotherGroup()
    {
        await RunAsAdministratorAsync();
        await AssertEnvGroupCount(0);

        // Create stack
        var stack = await CreateSampleStack();

        // Create first group
        var group1 = new StackEnvironmentVariableGroup
        {
            Id = Guid.NewGuid(),
            StackId = stack.Id,
            Name = "Group One",
            Description = "First group",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        // Create second group
        var group2 = new StackEnvironmentVariableGroup
        {
            Id = Guid.NewGuid(),
            StackId = stack.Id,
            Name = "Group Two",
            Description = "Second group",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await AddAsync(group1);
        await AddAsync(group2);
        await AssertEnvGroupCount(2);

        // Attempt to update group2 to have the same name as group1
        var exception = Assert.ThrowsAsync<ValidationException>(
            async () =>
                await SendAsync(
                    Command with
                    {
                        Id = group2.Id,
                        StackId = stack.Id,
                        Name = "Group One",
                        Description = "Updated description",
                    }
                )
        );

        exception.Should().NotBeNull();
        exception!.Errors.Should().ContainKey("EnvironmentVariableGroup").And.HaveCount(1);
        exception!
            .Errors["EnvironmentVariableGroup"]
            .Should()
            .Contain("Environment variable group name must be unique for this Stack");

        // Verify group2 was not updated
        var notUpdatedGroup = FetchEntity<StackEnvironmentVariableGroup>(x => x.Id == group2.Id);
        notUpdatedGroup.Should().NotBeNull();
        notUpdatedGroup!.Name.Should().Be("Group Two");
    }

    [Test]
    public async Task ShouldAllowUpdatingWithoutChangingName()
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
            Name = "My Group",
            Description = "Original description",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await AddAsync(group);
        await AssertEnvGroupCount(1);

        // Update only the description, keep the name the same
        await SendAsync(
            Command with
            {
                Id = group.Id,
                StackId = stack.Id,
                Name = "My Group", // Same name
                Description = "Updated description only",
            }
        );

        // Verify only the description was updated
        var updatedGroup = FetchEntity<StackEnvironmentVariableGroup>(x => x.Id == group.Id);
        updatedGroup.Should().NotBeNull();
        updatedGroup!.Name.Should().Be("My Group");
        updatedGroup!.Description.Should().Be("Updated description only");
    }
}
