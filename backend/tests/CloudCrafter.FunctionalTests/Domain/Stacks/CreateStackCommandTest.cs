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

        var project = FakerInstances.ProjectFaker.Generate();
        await AddAsync(project);

        var environment = FakerInstances.EnvironmentFaker(project).Generate();
        await AddAsync(environment);

        Command.EnvironmentId = environment.Id;
        Command.ServerId = server.Id;

        var result = await SendAsync(Command);

        result.Should().NotBeNull();
        result.Id.Should().NotBe(Guid.Empty);

        (await CountAsync<StackService>()).Should().Be(1);
    }
}
