using System.Data.Common;
using CloudCrafter.Core.Commands.Providers.Github;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Services.Core.Providers;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Moq;
using NUnit.Framework;
using Octokit;
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
            async () => await SendAsync(new CreateGithubProviderCommand.Command("dummy"))
        );
    }

    [Test]
    public async Task ShouldBeAbleToCreateFromGitHub()
    {
        await RunAsAdministratorAsync();

        // Setup
        (await CountAsync<GithubProvider>())
            .Should()
            .Be(0);

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
            [],
            "clientId",
            "clientSecret",
            "webHookSecret",
            "myPEM"
        );

        appsMock.Setup(x => x.CreateAppFromManifest("dummy")).ReturnsAsync(manifest);

        _mockProvider.Setup(x => x.GetClient()).Returns(_mockClient.Object);

        // Act
        var result = await SendAsync(new CreateGithubProviderCommand.Command("dummy"));

        // Assert
        result.Should().BeTrue();

        (await CountAsync<GithubProvider>()).Should().Be(1);
        var firstItem = await QueryFirstOrDefaultAsync<GithubProvider>(x =>
            x.AppClientId == "clientId"
        );

        firstItem.Should().NotBeNull();

        firstItem!.AppName.Should().Be(manifest.Name);
        firstItem.Name.Should().Be(manifest.Name);
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
        var result = await SendAsync(new CreateGithubProviderCommand.Command("dummy"));

        // Assert
        result.Should().BeFalse();

        (await CountAsync<GithubProvider>()).Should().Be(0);
    }
}
