using CloudCrafter.Core.Commands.Users;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Common.Filtering;
using CloudCrafter.Domain.Common.Pagination;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Users;

using static Testing;

public class GetUserListQueryTest : BaseTestFixture
{
    private readonly GetUserListQuery Query = new(new PaginatedRequest());

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Query));
    }

    [Test]
    public async Task ShouldThrowExceptionWhenUserIsNotAnAdministrator()
    {
        await RunAsDefaultUserAsync();
        Assert.ThrowsAsync<ForbiddenAccessException>(async () => await SendAsync(Query));
    }

    [Test]
    public async Task ShouldBeAbleToFetchUsersWhenLoggedIn()
    {
        await RunAsAdministratorAsync();

        var result = await SendAsync(Query);

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
            new PaginatedRequest
            {
                Filters = new List<FilterCriterea>
                {
                    new()
                    {
                        Operator = FilterOperatorOption.Contains,
                        PropertyName = "Email",
                        Value = randomUser.Email,
                    },
                },
            }
        );

        var result = await SendAsync(query);

        result.Should().NotBeNull();
        result.Result.Count.Should().Be(1);

        var userFromResult = result.Result.First();
        userFromResult.Id.Should().Be(randomUser.Id);

        // Now we should fetch for not equal
        query = new GetUserListQuery(
            new PaginatedRequest
            {
                Filters = new List<FilterCriterea>
                {
                    new()
                    {
                        Operator = FilterOperatorOption.NotEqual,
                        PropertyName = "Email",
                        Value = randomUser.Email,
                    },
                },
            }
        );

        result = await SendAsync(query);

        result.Should().NotBeNull();
        result.Result.Count.Should().Be(10);

        result.Result.Any(x => x.Email == randomUser.Email).Should().BeFalse();
    }
}
