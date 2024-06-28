using Ardalis.HttpClientTestExtensions;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Web.Contributors;
using FluentAssertions;
using NUnit.Framework;
using Xunit;

namespace CloudCrafter.FunctionalTests.ApiEndpoints;

using static Testing;

public class ContributorList : BaseTestFixture
{
    private readonly HttpClient _client = _factory.CreateClient();

    [OneTimeTearDown]
    public void TearDown()
    {
        _client?.Dispose();
    }

    [Test]
    public async Task ReturnsTwoContributors()
    {
        HttpResponseMessage async = await _client.GetAsync("/Contributors");
        string json = await async.Content.ReadAsStringAsync();
        var result = await _client.GetAndDeserializeAsync<ContributorListResponse>("/Contributors");

        result.Contributors.Count.Should().Be(2);

        result.Contributors.Any(x => x.Name == SeedData.Contributor1.Name).Should().BeTrue();


        result.Contributors.Any(x => x.Name == SeedData.Contributor2.Name).Should().BeTrue();
    }
}
