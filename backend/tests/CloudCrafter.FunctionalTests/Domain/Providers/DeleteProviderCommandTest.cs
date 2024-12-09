using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Providers.Github;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Providers;

using static Testing;

public class DeleteProviderCommandTest : BaseTestFixture
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new DeleteProviderCommand.Command(Guid.Empty))
        );
    }

    [Test]
    public async Task ShouldThrowExceptionWhenProviderDoesNotExists()
    {
        await RunAsAdministratorAsync();

        Assert.ThrowsAsync<NotFoundException>(
            async () => await SendAsync(new DeleteProviderCommand.Command(Guid.NewGuid()))
        );
    }

    [Test]
    public async Task ShouldBeAbleToDeleteProviderWithRelation()
    {
        await RunAsAdministratorAsync();

        var githubProvider = FakerInstances.SourceProviderFakerWithGitHub.Generate();
        await AddAsync(githubProvider);

        (await CountAsync<SourceProvider>()).Should().Be(1);
        (await CountAsync<GithubProvider>()).Should().Be(1);

        await SendAsync(new DeleteProviderCommand.Command(githubProvider.Id));

        (await CountAsync<SourceProvider>()).Should().Be(0);
        (await CountAsync<GithubProvider>()).Should().Be(0);
    }
}
