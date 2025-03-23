using CloudCrafter.Core.Commands.Auth;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Auth;

using static Testing;

public class PostCreateUserTest : BaseTestFixture
{
    [Test]
    public async Task ShouldBeAbleToCreateUser()
    {
        (await CountAsync<User>()).Should().Be(0);

        var now = DateTime.UtcNow.ToString("HH-mm-ss-fff");
        var query = new CreateUserCommand($"admin-{now}@domain.com", "Admin User");
        var result = await SendAsync(query);

        result.AccessToken.Length.Should().BeGreaterThan(10);

        now = DateTime.UtcNow.ToString("HH-mm-ss-fff");
        query = new CreateUserCommand($"admin-{now}@domain.com", "Admin User");
        result = await SendAsync(query);

        result.AccessToken.Length.Should().BeGreaterThan(10);

        (await CountAsync<User>()).Should().Be(2);
    }
}
