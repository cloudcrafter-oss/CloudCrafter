using CloudCrafter.Domain.Entities;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Teams;

using static Testing;

public class BaseTeamTest : BaseTestFixture
{
    public async Task AssertTeamCount(int expected)
    {
        (await CountAsync<Team>()).Should().Be(expected);
    }
}
