using CloudCrafter.Core.Commands.Users;
using CloudCrafter.Domain.Constants;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Users;

using static Testing;

public class GetCurrentUserRolesQueryTest : BaseTestFixture
{
    private readonly GetCurrentUserRolesQuery Query = new();

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Query));
    }

    [Test]
    public async Task ShouldBeAbleToGetRolesForAdministrator()
    {
        await RunAsAdministratorAsync();

        var result = await SendAsync(Query);
        result.Should().NotBeNull();

        result.Count.Should().Be(2);
        result.Should().Contain(x => x.Name == Roles.Administrator);
        result.Should().Contain(x => x.Name == Roles.User);
    }

    [Test]
    public async Task ShouldBeAbleToGetRolesForUser()
    {
        await RunAsDefaultUserAsync();

        var result = await SendAsync(Query);
        result.Should().NotBeNull();

        result.Count.Should().Be(1);
        result.Should().Contain(x => x.Name == Roles.User);
    }
}
