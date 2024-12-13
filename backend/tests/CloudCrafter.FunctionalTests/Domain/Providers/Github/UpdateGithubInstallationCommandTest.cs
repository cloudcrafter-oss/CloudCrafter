using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Providers.Github;
using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Domain.Domain.Providers;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Providers.Github;

using static Testing;

public class UpdateGithubInstallationCommandTest : BaseTestFixture
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () =>
                await SendAsync(
                    new UpdateGithubInstallationCommand.Command(
                        new UpdateGithubInstallationCommand.Request(123),
                        Guid.NewGuid()
                    )
                )
        );
    }

    [Test]
    public async Task ShouldThrowExceptionWhenProviderDoesNotExists()
    {
        await RunAsAdministratorAsync();

        Assert.ThrowsAsync<NotFoundException>(
            async () =>
                await SendAsync(
                    new UpdateGithubInstallationCommand.Command(
                        new UpdateGithubInstallationCommand.Request(123),
                        Guid.NewGuid()
                    )
                )
        );
    }

    [Test]
    public async Task ShouldBeAbleToSetInstallationId()
    {
        await RunAsAdministratorAsync();

        var githubProvider = FakerInstances.GithubProviderFaker.Generate();

        await AddAsync(githubProvider);

        githubProvider.InstallationId.Should().BeNull();
        (await CountAsync<GithubProvider>()).Should().Be(1);

        await SendAsync(
            new UpdateGithubInstallationCommand.Command(
                new UpdateGithubInstallationCommand.Request(123),
                githubProvider.SourceProvider.Id
            )
        );

        var updatedGithubProvider = await FindAsync<GithubProvider>(githubProvider.Id);
        updatedGithubProvider.Should().NotBeNull();
        updatedGithubProvider!.InstallationId.Should().Be(123);
    }

    [Test]
    public async Task ShouldNotBeAbleToSetInstallationIdAgain()
    {
        await RunAsAdministratorAsync();

        var githubProvider = FakerInstances
            .GithubProviderFaker.RuleFor(x => x.InstallationId, f => f.Random.Long())
            .Generate();

        await AddAsync(githubProvider);

        githubProvider.InstallationId.Should().NotBeNull();

        (await CountAsync<GithubProvider>()).Should().Be(1);

        await SendAsync(
            new UpdateGithubInstallationCommand.Command(
                new UpdateGithubInstallationCommand.Request(123),
                githubProvider.SourceProvider.Id
            )
        );

        var updatedGithubProvider = await FindAsync<GithubProvider>(githubProvider.Id);
        updatedGithubProvider.Should().NotBeNull();
        updatedGithubProvider!.InstallationId.Should().Be(githubProvider.InstallationId);
    }
}
