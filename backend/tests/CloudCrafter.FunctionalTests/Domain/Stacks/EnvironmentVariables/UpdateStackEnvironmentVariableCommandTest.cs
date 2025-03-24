using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.EnvironmentVariables;

using static Testing;

public class UpdateStackEnvironmentVariableCommandTest : BaseTestFixture
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

    private async Task AssertEnvCount(int count)
    {
        (await CountAsync<StackEnvironmentVariable>()).Should().Be(count);
    }

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [Test]
    public async Task ShouldHaveBasicValidation()
    {
        await RunAsAdministratorAsync();
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

    [Test]
    public async Task ShouldGetErrorWhenUpdatingEnvVarWhenStackDoesNotExists()
    {
        await RunAsAdministratorAsync();
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
    public async Task ShouldGetErrorWhenUpdatingEnvVarWhenEnvVarKeyAlreadyExists()
    {
        await RunAsAdministratorAsync();
        await AssertEnvCount(0);

        var stack = await CreateSampleStack();

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
}
