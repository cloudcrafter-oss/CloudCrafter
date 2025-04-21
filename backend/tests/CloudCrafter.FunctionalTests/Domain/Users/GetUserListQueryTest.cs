using CloudCrafter.Core.Commands.Users;
using CloudCrafter.Domain.Common.Filtering;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Domain.Requests.Filtering;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Users;

using static Testing;

public class GetUserListQueryTest : BaseTestFixture
{
    private GetUserListQuery _query = new GetUserListQuery(new());

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
        result.Result.Count.Should().Be(1);
    }

    [Test]
    public async Task ShouldBeAbleToFetchUsersWithFilter()
    {
        await RunAsAdministratorAsync();

        var users = FakerInstances.UserFaker.Generate(10);

        foreach (var user in users)
        {
            await AddAsync(user);
        }

        var count = await CountAsync<User>();
        count.Should().Be(11);

        // grab random user from users
        var randomUser = users[4];

        var query = new GetUserListQuery(
            new()
            {
                // Filters = new List<FilterCriterea>()
                // {
                //     new FilterCriterea()
                //     {
                //         Operator = FilterOperatorOption.Contains,
                //         PropertyName = "Email",
                //         Value = randomUser.Email,
                //     },
                // },
            }
        );

        var result = await SendAsync(query);

        result.Should().NotBeNull();
        result.Result.Count.Should().Be(1);

        var userFromResult = result.Result.First();
        userFromResult.Id.Should().Be(randomUser.Id);

        // Now we should fetch for not equal
        query = new GetUserListQuery(
            new()
            {
                // Filters = new List<FilterCriterea>()
                // {
                //     new FilterCriterea()
                //     {
                //         Operator = FilterOperatorOption.NotEqual,
                //         PropertyName = "Email",
                //         Value = randomUser.Email,
                //     },
                // },
            }
        );

        result = await SendAsync(query);

        result.Should().NotBeNull();
        result.Result.Count.Should().Be(10);

        result.Result.Any(x => x.Email == randomUser.Email).Should().BeFalse();
    }
}
