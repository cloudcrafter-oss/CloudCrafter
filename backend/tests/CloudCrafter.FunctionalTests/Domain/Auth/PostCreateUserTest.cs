using CloudCrafter.Core.Commands.Auth;
using CloudCrafter.Core.Interfaces.Domain.Auth;
using CloudCrafter.Domain.Constants;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Auth;

using static Testing;

public class PostCreateUserTest : BaseTestFixture
{
    [Test]
    public async Task ShouldBeAbleToCreateRegularUser()
    {
        (await CountAsync<User>()).Should().Be(0);
        var query = new CreateUserCommand($"admin@domain.com", "Admin User");
        await SendAsync(query);

        var userService = GetService<ICloudCrafterAuthService>();
        (await CountAsync<User>()).Should().Be(1);
        var user = FetchEntity<User>(x => x.IsActive);

        user.Should().NotBeNull();

        var roles = await userService.GetRoles(user!.Id);

        roles.Count.Should().Be(1);
        roles[0].Name.Should().Be(Roles.User);
    }

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
