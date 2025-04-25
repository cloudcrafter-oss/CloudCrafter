using System.Data.Common;
using CloudCrafter.Core.Commands.Providers.Github;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Services.Core.Providers;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Migrations;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Moq;
using NUnit.Framework;
using Octokit;
using Team = CloudCrafter.Domain.Entities.Team;
using User = Octokit.User;

namespace CloudCrafter.FunctionalTestWithMocks.Domain.Providers.Github;

public class CreateGithubProviderCommandTest : BaseReplaceTest
{
    private readonly Mock<IGitHubClient> _mockClient = new();
    private readonly Mock<IGithubClientProvider> _mockProvider = new();

    public override Task<CustomWebApplicationFactory> CustomSetup(
        DbConnection postgreSqlConnection,
        string redisConnectionString
    )
    {
        var factory = new CustomWebApplicationFactory(
            postgreSqlConnection,
            redisConnectionString,
            services =>
            {
                services.RemoveAll<IGithubClientProvider>();

                ServiceCollectionServiceExtensions.AddTransient(
                    services.RemoveAll<IUser>(),
                    provider => Mock.Of<IUser>(s => s.Id == _userId)
                );
                services.AddScoped<IGithubClientProvider>(_ => _mockProvider.Object);
            }
        );

        return Task.FromResult(factory);
    }

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new CreateGithubProviderCommand("dummy"))
        );
    }

    [Test]
    public async Task ShouldNotBeAbleToCreateProviderWithoutATeamAsARegularUser()
    {
        await RunAsDefaultUserAsync();

        Assert.ThrowsAsync<CloudCrafter.Core.Exceptions.ForbiddenAccessException>(
            async () => await SendAsync(new CreateGithubProviderCommand("dummy"))
        );
    }

    [Test]
    public async Task ShouldNotBeAbleToCreateProviderForATeamUserDoesNotHaveAccessTo()
    {
        var team = await CreateTeam();
        await RunAsDefaultUserAsync();

        Assert.ThrowsAsync<CloudCrafter.Core.Exceptions.ForbiddenAccessException>(
            async () =>
                await SendAsync(new CreateGithubProviderCommand("dummy") { TeamId = team.Id })
        );
    }

    [TestCase(true, false)]
    [TestCase(false, true)]
    [TestCase(false, false)]
    public async Task ShouldBeAbleToCreateFromGitHub(bool isAdmin, bool teamOwner)
    {
        Team? team = null;
        if (isAdmin)
        {
            await RunAsAdministratorAsync();
        }
        else
        {
            var userId = await RunAsDefaultUserAsync();

            if (teamOwner)
            {
                team = await CreateTeam(userId!.Value);
            }
            else
            {
                team = await CreateTeam();
                await AddToTeam(team, userId);
            }
        }

        // Setup
        (await CountAsync<GithubProvider>())
            .Should()
            .Be(0);
        (await CountAsync<SourceProvider>()).Should().Be(0);

        var appsMock = new Mock<IGitHubAppsClient>();

        _mockClient.Setup(x => x.GitHubApps).Returns(appsMock.Object);

        var manifest = new GitHubAppFromManifest(
            1234,
            "slug",
            "node-id",
            "name",
            new User(),
            "description",
            "externalUrl",
            "htmlUrl",
            DateTimeOffset.Now,
            DateTimeOffset.Now,
            new InstallationPermissions(),
            new string[] { },
            "clientId",
            "clientSecret",
            "webHookSecret",
            "myPEM"
        );

        appsMock.Setup(x => x.CreateAppFromManifest("dummy")).ReturnsAsync(manifest);

        _mockProvider.Setup(x => x.GetClient()).Returns(_mockClient.Object);

        // Act
        var result = await SendAsync(
            new CreateGithubProviderCommand("dummy") { TeamId = team?.Id }
        );

        // Assert
        result.Should().BeTrue();

        (await CountAsync<GithubProvider>()).Should().Be(1);
        (await CountAsync<SourceProvider>()).Should().Be(1);
        var firstItem = await QueryFirstOrDefaultAsync<GithubProvider>(x =>
            x.AppClientId == "clientId"
        );

        var ctx = GetService<IApplicationDbContext>();
        var provider = await ctx
            .SourceProviders.Include(x => x.GithubProvider)
            .FirstOrDefaultAsync();

        provider.Should().NotBeNull();
        firstItem.Should().NotBeNull();

        provider!.GithubProvider.Should().NotBeNull();
        provider.GithubProviderId.Should().Be(firstItem!.Id);

        if (isAdmin)
        {
            provider.TeamId.Should().BeNull();
        }
        else
        {
            provider.TeamId.Should().Be(team!.Id);
        }

        firstItem.AppName.Should().Be(manifest.Name);
        firstItem.AppId.Should().Be(manifest.Id);
        firstItem.AppClientId.Should().Be(manifest.ClientId);
        firstItem.AppClientSecret.Should().Be(manifest.ClientSecret);
        firstItem.AppWebhookSecret.Should().Be(manifest.WebhookSecret);
        firstItem.AppPrivateKey.Should().Be(manifest.Pem);
        firstItem.InstallationId.Should().BeNull();
        firstItem.AppUrl.Should().Be(manifest.HtmlUrl);
    }

    [Test]
    public async Task ShouldNotBeAbleToCreateGithubProvider()
    {
        await RunAsAdministratorAsync();

        // Setup
        (await CountAsync<GithubProvider>())
            .Should()
            .Be(0);

        var appsMock = new Mock<IGitHubAppsClient>();

        _mockClient.Setup(x => x.GitHubApps).Returns(appsMock.Object);

        appsMock
            .Setup(x => x.CreateAppFromManifest("dummy"))
            .ReturnsAsync((GitHubAppFromManifest?)null);

        _mockProvider.Setup(x => x.GetClient()).Returns(_mockClient.Object);

        // Act
        var result = await SendAsync(new CreateGithubProviderCommand("dummy"));

        // Assert
        result.Should().BeFalse();

        (await CountAsync<GithubProvider>()).Should().Be(0);
    }
}
