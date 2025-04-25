using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.EnvironmentVariables;

using static Testing;

public class CreateStackEnvironmentVariableCommandTest : BaseEnvironmentVariablesTest
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
    public async Task ShouldNotCreateEnvironmentVariableBecauseGroupDoesNotExists()
    {
        await RunAsAdministratorAsync();
        await AssertEnvCount(0);

        var stack = await CreateSampleStack();

        var exception = Assert.ThrowsAsync<ValidationException>(
            async () =>
                await SendAsync(
                    Command with
                    {
                        StackId = stack.Id,
                        Key = "Test",
                        Value = "Dummy",
                        GroupId = Guid.NewGuid(),
                    }
                )
        );
        exception.Should().NotBeNull();
        exception!.Errors.Should().ContainKey("EnvironmentVariableGroup").And.HaveCount(1);
        exception!
            .Errors["EnvironmentVariableGroup"]
            .Should()
            .Contain("Environment variable group is not found within this Stack");

        await AssertEnvCount(0);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToCreateEnvironmentVariableBecauseUserDoesNotHavePermissionToTeam(
        bool attachUserToTeam
    )
    {
        var userId = await RunAsDefaultUserAsync();
        var stack = await CreateSampleStack();

        if (attachUserToTeam)
        {
            await AddToTeam(stack.Environment.Project.Team, userId);
        }

        Assert.ThrowsAsync<NotEnoughPermissionInTeamException>(
            async () =>
                await SendAsync(Command with { StackId = stack.Id, Key = "Test", Value = "Dummy" })
        );
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToCreateEnvironmentVariable(bool runAsAdministrator)
    {
        await AssertEnvCount(0);
        var stack = await CreateSampleStack();
        if (runAsAdministrator)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            var userId = await RunAsDefaultUserAsync();
            await AddToTeam(stack.Environment.Project.Team, userId);
        }

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
        entity.GroupId.Should().BeNull();
        entity.StackId.Should().Be(stack.Id);
    }

    [Test]
    public async Task ShouldBeAbleToCreateEnvironmentVariableWithGroup()
    {
        await RunAsAdministratorAsync();
        await AssertEnvCount(0);

        var stack = await CreateSampleStack();

        var group = FakerInstances.StackEnvironmentVariableGroupFaker(stack).Generate();
        await AddAsync(group);

        await AssertEnvGroupCount(1);

        var result = await SendAsync(
            Command with
            {
                StackId = stack.Id,
                GroupId = group.Id,
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
        entity.GroupId.Should().Be(group.Id);
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

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToCreateAnEnvironmentVariableWithSecret(bool isSecret)
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
                IsSecret = isSecret,
            }
        );
        await AssertEnvCount(1);

        var entity = FetchEntity<StackEnvironmentVariable>(x => x.Id == result);
        entity.Should().NotBeNull();
        entity!.Key.Should().Be("Test");
        entity!.Value.Should().Be("Dummy");
        entity!.IsSecret.Should().Be(isSecret);
        entity.StackId.Should().Be(stack.Id);
    }

    [TestCase(EnvironmentVariableType.Both)]
    [TestCase(EnvironmentVariableType.BuildTime)]
    [TestCase(EnvironmentVariableType.Runtime)]
    public async Task ShouldBeAbleToCreateAnEnvironmentVariableWithType(
        EnvironmentVariableType type
    )
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
                Type = type,
            }
        );
        await AssertEnvCount(1);

        var entity = FetchEntity<StackEnvironmentVariable>(x => x.Id == result);
        entity.Should().NotBeNull();
        entity!.Key.Should().Be("Test");
        entity!.Value.Should().Be("Dummy");
        entity.StackId.Should().Be(stack.Id);
        entity.Type.Should().Be(type);
    }
}
