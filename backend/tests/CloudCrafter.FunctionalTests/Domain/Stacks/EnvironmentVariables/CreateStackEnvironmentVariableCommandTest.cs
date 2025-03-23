using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.EnvironmentVariables;

using static Testing;

public class CreateStackEnvironmentVariableCommandTest : BaseTestFixture
{
    private readonly CreateStackEnvironmentVariableCommand Command =
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

    private async Task AssertEnvCount(int count)
    {
        (await CountAsync<StackEnvironmentVariable>()).Should().Be(count);
    }

    [Test]
    public async Task ShouldNotCreateEnvironmentVariableBecauseValidation()
    {
        await RunAsAdministratorAsync();

        var exception = Assert.ThrowsAsync<ValidationException>(
            async () => await SendAsync(Command)
        );

        exception.Should().NotBeNull();
        exception!.Errors.Should().ContainKey("Key").And.HaveCount(2);
        exception!.Errors["Key"].Should().Contain("Environment variable key is required");
        exception!.Errors["Value"].Should().Contain("Environment variable value is required");

        await AssertEnvCount(0);
    }

    [Test]
    public async Task ShouldNotCreateEnvironmentVariableBecauseStackDoesNotExists()
    {
        await RunAsAdministratorAsync();
        await AssertEnvCount(0);

        var exception = Assert.ThrowsAsync<ValidationException>(
            async () => await SendAsync(Command with { Key = "Test", Value = "Dummy" })
        );
        exception.Should().NotBeNull();
        exception!.Errors.Should().ContainKey("Stack").And.HaveCount(1);
        exception!.Errors["Stack"].Should().Contain("Stack not found");

        await AssertEnvCount(0);
    }

    [Test]
    public async Task ShouldBeAbleToCreateEnvironmentVariable()
    {
        await RunAsAdministratorAsync();
        await AssertEnvCount(0);

        var stack = await CreateSampleStack();

        var result = await SendAsync(
            Command with
            {
                StackId = stack.Id,
                Key = "Test",
                Value = "Dummy",
            }
        );

        await AssertEnvCount(1);

        var entity = FetchEntity<StackEnvironmentVariable>(x => x.Id == result);
        entity.Should().NotBeNull();
        entity!.Key.Should().Be("Test");
        entity!.Value.Should().Be("Dummy");
        entity!.IsSecret.Should().BeFalse();
        entity.StackId.Should().Be(stack.Id);
    }

    [Test]
    public async Task ShouldNotBeAbleToCreateAnEnvironmentVariableWithSameKey()
    {
        await RunAsAdministratorAsync();
        await AssertEnvCount(0);

        var stack = await CreateSampleStack();

        var envVar = FakerInstances
            .StackEnvironmentVariableFaker(stack)
            .RuleFor(x => x.Key, "MY_KEY")
            .Generate();

        await AddAsync(envVar);
        await AssertEnvCount(1);

        var exception = Assert.ThrowsAsync<ValidationException>(
            async () =>
                await SendAsync(
                    Command with
                    {
                        StackId = stack.Id,
                        Key = "MY_KEY",
                        Value = "Another value",
                    }
                )
        );

        exception.Should().NotBeNull();
        exception!.Errors.Should().ContainKey("EnvironmentVariable").And.HaveCount(1);
        exception!
            .Errors["EnvironmentVariable"]
            .Should()
            .Contain("Environment variable key must be unique");
        await AssertEnvCount(1);
    }
}
