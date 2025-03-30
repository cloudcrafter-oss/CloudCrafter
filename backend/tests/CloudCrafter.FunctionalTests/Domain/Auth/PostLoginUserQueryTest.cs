using CloudCrafter.Core.Commands.Auth;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Auth;

using static Testing;

public class PostLoginUserQueryTest : BaseTestFixture
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotFound()
    {
        var query = new LoginUserCommand("test@test.com", "password");
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(query));
    }

    [Test]
    public async Task ShouldGetTokenWhenUserIsCorrect()
    {
        var now = DateTime.UtcNow;
        var user = await CreateAdminUser();

        var query = new LoginUserCommand(user.Email, user.Password);

        var result = await SendAsync(query);

        result.RefreshToken.Length.Should().BeGreaterThan(10); // safe to assume its there
        result.AccessToken.Length.Should().BeGreaterThan(10); // safe to assume its there
        result.RefreshTokenExpires.Should().BeAfter(now);
    }
}
