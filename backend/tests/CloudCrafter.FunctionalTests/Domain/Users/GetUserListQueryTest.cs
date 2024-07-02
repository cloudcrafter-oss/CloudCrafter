using CloudCrafter.Core.Commands.Users;
using CloudCrafter.Domain.Requests.Filtering;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Users;
using static Testing;

public class GetUserListQueryTest : BaseTestFixture
{
    private GetUserList.Query _query = new GetUserList.Query(new BasePaginationRequest());
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(_query));
    }

    [Test]
    public async Task ShouldBeAbleToFetchUsersWhenLoggedIn()
    {
        await RunAsAdministratorAsync();

        var result = await SendAsync(_query);

        result.Should().NotBeNull();
        result.Result.Count.Should().Be(2);
    }
}
