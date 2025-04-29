﻿using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Domain.Application.Services;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Stacks;

using static Testing;

public class CreateStackCommandTest : BaseTestFixture
{
    private readonly CreateStackCommand Command =
        new()
        {
            Name = "Dummy Stack",
            GitRepository = "https://github.com/cloudcrafter-oss/demo-examples",
            GitBranch = "main",
            PathInGitRepository = "",
            ServerId = Guid.NewGuid(),
            EnvironmentId = Guid.NewGuid(),
        };

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldThrowExceptionWhenServerIdIsNotFound(bool isAdmin)
    {
        await RunAsUserRoleAsync(isAdmin);
        var exception = Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(Command)
        );

        exception.Message.Should().Be($"User does not have access to server {Command.ServerId}");

        (await CountAsync<Stack>()).Should().Be(0);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldThrowExceptionWhenEnvironmentIsNotFound(bool isAdmin)
    {
        await RunAsUserRoleAsync(isAdmin);

        var server = FakerInstances.ServerFaker.Generate();
        await AddAsync(server);

        Command.ServerId = server.Id;

        var exception = Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(Command)
        );

        var message = isAdmin
            ? $"User does not have access to environment {Command.EnvironmentId}"
            : $"User does not have access to server {Command.ServerId}";

        exception.Message.Should().Be(message);
        (await CountAsync<Stack>()).Should().Be(0);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToCreateStack(bool isAdmin)
    {
        var userId = await RunAsUserRoleAsync(isAdmin);

        var team = await CreateTeam(!isAdmin ? userId : null);

        var server = FakerInstances.ServerFaker.RuleFor(x => x.TeamId, team.Id).Generate();
        await AddAsync(server);

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

        var stack = FetchEntity<StackService>(x => x.StackId == result.Id);
        stack.Should().NotBeNull();
        stack!.StackServiceTypeId.Should().Be(StackServiceTypeConstants.App);
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

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToCreateStackBecauseUserIsNotCorrectTeamMember(
        bool attachToTeam
    )
    {
        var userId = await RunAsDefaultUserAsync();

        var team = await CreateTeam();

        if (attachToTeam)
        {
            await AddToTeam(team, userId);
        }

        var server = FakerInstances.ServerFaker.RuleFor(x => x.TeamId, team.Id).Generate();
        await AddAsync(server);

        var project = FakerInstances.ProjectFaker(team.Id).Generate();
        await AddAsync(project);

        var environment = FakerInstances.EnvironmentFaker(project).Generate();
        await AddAsync(environment);

        Command.EnvironmentId = environment.Id;
        Command.ServerId = server.Id;

        (await CountAsync<StackEnvironmentVariableGroup>()).Should().Be(0);

        if (!attachToTeam)
        {
            Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
        }
        else
        {
            Assert.ThrowsAsync<NotEnoughPermissionInTeamException>(
                async () => await SendAsync(Command)
            );
        }
    }
}
