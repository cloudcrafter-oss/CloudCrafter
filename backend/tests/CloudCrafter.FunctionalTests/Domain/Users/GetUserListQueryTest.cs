using CloudCrafter.Core.Commands.Users;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Users;
using static Testing;

public class GetUserListQueryTest : BaseTestFixture
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        var query = new GetUserList.Query();
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(query));
    }

    [Test]
    public async Task ShouldBeAbleToFetchUsersWhenLoggedIn()
    {
        var query = new GetUserList.Query();

        await RunAsAdministratorAsync();

        var result = await SendAsync(query);

        result.Should().NotBeNull();
        result.Result.Count.Should().Be(3);
    }
}
