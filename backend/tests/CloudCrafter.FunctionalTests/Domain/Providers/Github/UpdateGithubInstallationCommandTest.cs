using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Providers.Github;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

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
                    new UpdateGithubInstallationCommand(
                        new UpdateGithubInstallationRequest(123),
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
                    new UpdateGithubInstallationCommand(
                        new UpdateGithubInstallationRequest(123),
                        Guid.NewGuid()
                    )
                )
        );
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToSetInstallationId(bool isAdmin)
    {
        Team? team = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            var userId = await RunAsDefaultUserAsync();
            team = await CreateTeam(userId);
        }

        var githubProvider = FakerInstances.GithubProviderFaker(team?.Id).Generate();

        await AddAsync(githubProvider);

        githubProvider.InstallationId.Should().BeNull();
        (await CountAsync<GithubProvider>()).Should().Be(1);

        await SendAsync(
            new UpdateGithubInstallationCommand(
                new UpdateGithubInstallationRequest(123),
                githubProvider.SourceProvider.Id
            )
        );

        var updatedGithubProvider = await FindAsync<GithubProvider>(githubProvider.Id);
        updatedGithubProvider.Should().NotBeNull();
        updatedGithubProvider!.InstallationId.Should().Be(123);
    }

    [Test]
    public async Task ShouldBeNotAbleToSetInstallationIdBecauseUserIsNotATeamOwner()
    {
        await RunAsDefaultUserAsync();

        var githubProvider = FakerInstances.GithubProviderFaker().Generate();

        await AddAsync(githubProvider);

        githubProvider.InstallationId.Should().BeNull();
        (await CountAsync<GithubProvider>()).Should().Be(1);

        Assert.ThrowsAsync<NotFoundException>(
            async () =>
                await SendAsync(
                    new UpdateGithubInstallationCommand(
                        new UpdateGithubInstallationRequest(123),
                        githubProvider.SourceProvider.Id
                    )
                )
        );
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToSetInstallationIdAgain(bool isAdmin)
    {
        Team? team = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            var userId = await RunAsDefaultUserAsync();
            team = await CreateTeam(userId);
        }

        var githubProvider = FakerInstances
            .GithubProviderFaker(team?.Id)
            .RuleFor(x => x.InstallationId, f => f.Random.Long())
            .Generate();

        await AddAsync(githubProvider);

        githubProvider.InstallationId.Should().NotBeNull();

        (await CountAsync<GithubProvider>()).Should().Be(1);

        await SendAsync(
            new UpdateGithubInstallationCommand(
                new UpdateGithubInstallationRequest(123),
                githubProvider.SourceProvider.Id
            )
        );

        var updatedGithubProvider = await FindAsync<GithubProvider>(githubProvider.Id);
        updatedGithubProvider.Should().NotBeNull();
        updatedGithubProvider!.InstallationId.Should().Be(githubProvider.InstallationId);
    }
}
