using CloudCrafter.Core.Commands.Auth;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Auth;

using static Testing;

public class PostRefreshUserTokensTest : BaseTestFixture
{
    [Test]
    public async Task ShouldThrowExceptionWhenTokenIsNotFound()
    {
        (await CountAsync<UserRefreshToken>()).Should().Be(0);
        var query = new RefreshUserTokenCommand("dont-bother-this-doesnt-exist-anyway");
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(query));
    }

    [Test]
    public async Task ShouldBeAbleToRefreshTokens()
    {
        (await CountAsync<UserRefreshToken>()).Should().Be(0);

        var user = await CreateAdminUser();

        var query = new LoginUserCommand(user.Email, user.Password);

        var createUserResult = await SendAsync(query);

        var refreshQuery = new RefreshUserTokenCommand(createUserResult.RefreshToken);
        var result = await SendAsync(refreshQuery);

        (await CountAsync<UserRefreshToken>()).Should().Be(2);
        result.RefreshToken.Length.Should().BeGreaterThan(10);
        result.AccessToken.Length.Should().BeGreaterThan(10);
    }

    [Test]
    public async Task ShouldBeAbleToUseRefreshTokenOnlyOnce()
    {
        (await CountAsync<UserRefreshToken>()).Should().Be(0);

        var user = await CreateAdminUser();

        var query = new LoginUserCommand(user.Email, user.Password);

        var createUserResult = await SendAsync(query);

        var refreshQuery = new RefreshUserTokenCommand(createUserResult.RefreshToken);
        var result = await SendAsync(refreshQuery);

        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new RefreshUserTokenCommand(createUserResult.RefreshToken))
        );

        // Assert that new one still works
        var newTokenResult = await SendAsync(new RefreshUserTokenCommand(result.RefreshToken));
        newTokenResult.RefreshToken.Length.Should().BeGreaterThan(10);
        newTokenResult.AccessToken.Length.Should().BeGreaterThan(10);

        (await CountAsync<UserRefreshToken>()).Should().Be(3);
    }
}
