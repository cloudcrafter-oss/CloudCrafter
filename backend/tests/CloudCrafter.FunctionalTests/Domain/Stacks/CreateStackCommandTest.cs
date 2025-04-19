using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks;

using static Testing;

public class CreateStackCommandTest : BaseTestFixture
{
    private readonly CreateStackCommand Command =
        new()
        {
            Name = "Dummy Stack",
            GitRepository = "https://github.com/cloudcrafter-oss/demo-examples",
            ServerId = Guid.NewGuid(),
            EnvironmentId = Guid.NewGuid(),
        };

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [Test]
    public async Task ShouldThrowExceptionWhenServerIdIsNotFound()
    {
        await RunAsAdministratorAsync();
        var exception = Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(Command)
        );

        exception.Message.Should().Be($"User does not have access to server {Command.ServerId}");

        (await CountAsync<Stack>()).Should().Be(0);
    }

    [Test]
    public async Task ShouldThrowExceptionWhenEnvironmentIsNotFound()
    {
        await RunAsAdministratorAsync();

        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);

        Command.ServerId = server.Id;

        var exception = Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(Command)
        );

        exception
            .Message.Should()
            .Be($"User does not have access to environment {Command.EnvironmentId}");
        (await CountAsync<Stack>()).Should().Be(0);
    }

    [Test]
    public async Task ShouldBeAbleToCreateStack()
    {
        await RunAsAdministratorAsync();

        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);

        var team = await CreateTeam();
        var project = FakerInstances.ProjectFaker(team.Id).Generate();
        await AddAsync(project);

        var environment = FakerInstances.EnvironmentFaker(project).Generate();
        await AddAsync(environment);

        Command.EnvironmentId = environment.Id;
        Command.ServerId = server.Id;

        (await CountAsync<StackEnvironmentVariableGroup>()).Should().Be(0);

        var result = await SendAsync(Command);

        result.Should().NotBeNull();
        result.Id.Should().NotBe(Guid.Empty);

        (await CountAsync<StackService>()).Should().Be(1);
        (await CountAsync<StackEnvironmentVariableGroup>()).Should().Be(2);

        // Check if the environment variable groups are created
        var groups = FetchEntityList<StackEnvironmentVariableGroup>(x => x.StackId == result.Id);

        groups.Should().HaveCount(2);

        var appSettings = groups.FirstOrDefault(x => x.Name == "Application Settings");
        appSettings.Should().NotBeNull();
        appSettings!.StackId.Should().Be(result.Id);
        appSettings.Description.Should().Be("Basic application environment variables");

        var connectionStrings = groups.FirstOrDefault(x => x.Name == "Database Settings");
        connectionStrings.Should().NotBeNull();
        connectionStrings!.StackId.Should().Be(result.Id);
        connectionStrings.Description.Should().Be("Database connection environment variables");
    }
}
