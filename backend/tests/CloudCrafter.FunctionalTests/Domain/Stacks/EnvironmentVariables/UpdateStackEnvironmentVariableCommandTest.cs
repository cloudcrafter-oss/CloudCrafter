using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.EnvironmentVariables;

using static Testing;

public class UpdateStackEnvironmentVariableCommandTest : BaseEnvironmentVariablesTest
{
    private readonly UpdateStackEnvironmentVariableCommand Command =
        new()
        {
            StackId = Guid.NewGuid(),
            Key = "",
            Value = "",
            IsSecret = false,
            Type = EnvironmentVariableType.BuildTime,
        };

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldHaveBasicValidation(bool isAdmin)
    {
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            await RunAsDefaultUserAsync();
        }

        await AssertEnvCount(0);
        var exception = Assert.ThrowsAsync<ValidationException>(
            async () => await SendAsync(Command)
        );
        exception.Should().NotBeNull();
        exception!.Errors.Should().ContainKey("Key").And.HaveCount(2);
        exception!.Errors["Key"].Should().Contain("Environment variable key is required");
        exception!.Errors["Id"].Should().Contain("Environment variable ID is required");

        await AssertEnvCount(0);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldGetErrorWhenUpdatingEnvVarWhenStackDoesNotExists(bool isAdmin)
    {
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            await RunAsDefaultUserAsync();
        }

        await AssertEnvCount(0);
        var exception = Assert.ThrowsAsync<ValidationException>(
            async () =>
                await SendAsync(
                    Command with
                    {
                        Key = "DUMMY",
                        Value = "My_Value",
                        Id = Guid.NewGuid(),
                        StackId = Guid.NewGuid(),
                    }
                )
        );
        exception.Should().NotBeNull();
        exception!.Errors.Should().ContainKey("Stack").And.HaveCount(1);
        exception!.Errors["Stack"].Should().Contain("Stack not found");

        await AssertEnvCount(0);
    }

    [Test]
    public async Task ShouldGetErrorWhenUpdatingEnvVarWhenEnvVarDoesNotExists()
    {
        await RunAsAdministratorAsync();
        await AssertEnvCount(0);

        var stack = await CreateSampleStack();
        var exception = Assert.ThrowsAsync<ValidationException>(
            async () =>
                await SendAsync(
                    Command with
                    {
                        Key = "DUMMY",
                        Value = "My_Value",
                        Id = Guid.NewGuid(),
                        StackId = stack.Id,
                    }
                )
        );
        exception.Should().NotBeNull();
        exception!.Errors.Should().ContainKey("EnvironmentVariable").And.HaveCount(1);
        exception!.Errors["EnvironmentVariable"].Should().Contain("Environment variable not found");

        await AssertEnvCount(0);
    }

    [Test]
    public async Task ShouldNotHavePermissionForStackToUpdateTheEnvVariable()
    {
        await RunAsDefaultUserAsync();
        await AssertEnvCount(0);

        var stack = await CreateSampleStack();
        Assert.ThrowsAsync<NotEnoughPermissionInTeamException>(
            async () =>
                await SendAsync(
                    Command with
                    {
                        Key = "DUMMY",
                        Value = "My_Value",
                        Id = Guid.NewGuid(),
                        StackId = stack.Id,
                    }
                )
        );

        await AssertEnvCount(0);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldGetErrorWhenUpdatingEnvVarWhenEnvVarKeyAlreadyExists(bool isAdmin)
    {
        Guid? ownerId = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            ownerId = await RunAsDefaultUserAsync();
        }

        await AssertEnvCount(0);

        var stack = await CreateSampleStack(null, ownerId);

        var envVar = FakerInstances
            .StackEnvironmentVariableFaker(stack)
            .RuleFor(x => x.Key, "MY_KEY")
            .Generate();

        var envVarToUpdate = FakerInstances
            .StackEnvironmentVariableFaker(stack)
            .RuleFor(x => x.Key, "MY_KEY_TWO")
            .Generate();

        await AddAsync(envVar);
        await AddAsync(envVarToUpdate);
        await AssertEnvCount(2);

        var exception = Assert.ThrowsAsync<ValidationException>(
            async () =>
                await SendAsync(
                    Command with
                    {
                        Key = "MY_KEY",
                        Value = "My_Value",
                        Id = envVarToUpdate.Id,
                        StackId = stack.Id,
                    }
                )
        );
        exception.Should().NotBeNull();
        exception!.Errors.Should().ContainKey("EnvironmentVariable").And.HaveCount(1);
        exception!
            .Errors["EnvironmentVariable"]
            .Should()
            .Contain("Environment variable key must be unique");

        var firstEnvValue = FetchEntity<StackEnvironmentVariable>(x => x.Id == envVar.Id);
        firstEnvValue.Should().NotBeNull();
        firstEnvValue
            .Should()
            .BeEquivalentTo(
                envVar,
                opt => opt.Excluding(x => x.CreatedAt).Excluding(x => x.UpdatedAt)
            );

        var secondEnvValue = FetchEntity<StackEnvironmentVariable>(x => x.Id == envVarToUpdate.Id);
        secondEnvValue.Should().NotBeNull();
        secondEnvValue
            .Should()
            .BeEquivalentTo(
                envVarToUpdate,
                opt => opt.Excluding(x => x.CreatedAt).Excluding(x => x.UpdatedAt)
            );

        await AssertEnvCount(2);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldSuccessfullyUpdateEnvironmentVariable(bool isAdmin)
    {
        Guid? ownerId = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            ownerId = await RunAsDefaultUserAsync();
        }

        await AssertEnvCount(0);

        // Create stack
        var stack = await CreateSampleStack(null, ownerId);

        // Create environment variable to update
        var envVar = new StackEnvironmentVariable
        {
            Id = Guid.NewGuid(),
            StackId = stack.Id,
            Key = "ORIGINAL_KEY",
            Value = "Original Value",
            IsSecret = false,
            Type = EnvironmentVariableType.Both,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await AddAsync(envVar);
        await AssertEnvCount(1);

        // Update the variable
        await SendAsync(
            Command with
            {
                Id = envVar.Id,
                StackId = stack.Id,
                Key = "UPDATED_KEY",
                Value = "Updated Value",
                IsSecret = true,
                Type = EnvironmentVariableType.Runtime,
            }
        );

        // Retrieve updated entity and verify changes
        var updatedVar = FetchEntity<StackEnvironmentVariable>(x => x.Id == envVar.Id);

        updatedVar.Should().NotBeNull();
        updatedVar!.Key.Should().Be("UPDATED_KEY");
        updatedVar!.Value.Should().Be("Updated Value");
        updatedVar!.IsSecret.Should().BeTrue();
        updatedVar!.Type.Should().Be(EnvironmentVariableType.Runtime);

        await AssertEnvCount(1);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldSuccessfullyUpdateEnvironmentVariableToAGroup(bool isAdmin)
    {
        Guid? ownerId = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            ownerId = await RunAsDefaultUserAsync();
        }

        await AssertEnvCount(0);
        await AssertEnvGroupCount(0);

        // Create stack
        var stack = await CreateSampleStack(null, ownerId);

        var group = FakerInstances.StackEnvironmentVariableGroupFaker(stack).Generate();
        await AddAsync(group);
        await AssertEnvGroupCount(1);

        var envVar = FakerInstances.StackEnvironmentVariableFaker(stack).Generate();

        await AddAsync(envVar);
        await AssertEnvCount(1);

        // Update the variable
        await SendAsync(
            Command with
            {
                Id = envVar.Id,
                StackId = stack.Id,
                Key = "UPDATED_KEY",
                GroupId = group.Id,
                Value = "Updated Value",
                IsSecret = true,
                Type = EnvironmentVariableType.Runtime,
            }
        );

        // Retrieve updated entity and verify changes
        var updatedVar = FetchEntity<StackEnvironmentVariable>(x => x.Id == envVar.Id);

        updatedVar.Should().NotBeNull();
        updatedVar!.Key.Should().Be("UPDATED_KEY");
        updatedVar!.Value.Should().Be("Updated Value");
        updatedVar!.IsSecret.Should().BeTrue();
        updatedVar!.Type.Should().Be(EnvironmentVariableType.Runtime);
        updatedVar.GroupId.Should().Be(group.Id);

        await AssertEnvCount(1);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldSuccessfullyUpdateEnvironmentVariableGroup(bool isAdmin)
    {
        Guid? ownerId = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            ownerId = await RunAsDefaultUserAsync();
        }

        await AssertEnvGroupCount(0);

        // Create stack
        var stack = await CreateSampleStack(null, ownerId);

        // Create environment variable group
        var group = new StackEnvironmentVariableGroup
        {
            Id = Guid.NewGuid(),
            StackId = stack.Id,
            Name = "Original Group Name",
            Description = "Original description",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await AddAsync(group);
        await AssertEnvGroupCount(1);

        // Update the group
        var command = new UpdateStackEnvironmentVariableGroupCommand
        {
            Id = group.Id,
            StackId = stack.Id,
            Name = "Updated Group Name",
            Description = "Updated description",
        };

        await SendAsync(command);

        // Retrieve updated entity and verify changes
        var updatedGroup = FetchEntity<StackEnvironmentVariableGroup>(x => x.Id == group.Id);

        updatedGroup.Should().NotBeNull();
        updatedGroup!.Name.Should().Be("Updated Group Name");
        updatedGroup!.Description.Should().Be("Updated description");
        updatedGroup!.StackId.Should().Be(stack.Id);

        await AssertEnvGroupCount(1);
    }
}
