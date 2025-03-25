using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

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

    [Test]
    public async Task ShouldBeAbleToCreateEnvironmentVariableGroup()
    {
        await RunAsAdministratorAsync();
        await AssertEnvGroupCount(0);

        var stack = await CreateSampleStack();

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
