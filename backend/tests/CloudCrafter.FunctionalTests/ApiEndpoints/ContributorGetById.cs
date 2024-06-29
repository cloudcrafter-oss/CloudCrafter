using Ardalis.HttpClientTestExtensions;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Web.Contributors;
using FluentAssertions;
using NUnit.Framework;
using Xunit;

namespace CloudCrafter.FunctionalTests.ApiEndpoints;

using static Testing;

public class ContributorGetById : BaseTestFixture
{
    private readonly HttpClient _client = _factory.CreateClient();

    [OneTimeTearDown]
    public void TearDown()
    {
        _client?.Dispose();
    }


    [Test]
    public async Task ReturnsSeedContributorGivenId1()
    {
        var result = await _client.GetAndDeserializeAsync<ContributorRecord>(GetContributorByIdRequest.BuildRoute(1));

        result.Id.Should().Be(1);
        result.Name.Should().Be(SeedData.Contributor1.Name);
    }

    [Test]
    public async Task ReturnsNotFoundGivenId1000()
    {
        string route = GetContributorByIdRequest.BuildRoute(1000);
        _ = await _client.GetAndEnsureNotFoundAsync(route);
    }
}
