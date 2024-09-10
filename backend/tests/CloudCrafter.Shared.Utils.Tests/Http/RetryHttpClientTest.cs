using System.Diagnostics;
using System.Net;
using CloudCrafter.Shared.Utils.Http;
using Docker.DotNet.Models;
using FluentAssertions;
using Moq;
using Moq.Protected;

namespace CloudCrafter.Shared.Utils.Tests.Http;

public class RetryHttpClientTest
{
    [Test]
    public void ShouldNotBeAbleToGetResponse()
    {
        var client = RetryHttpClientFactory.Create(3);
        var sw = Stopwatch.StartNew();

        sw.Start();
        var exception = Assert.ThrowsAsync<HttpRequestException>(
            () => client.SendAsync(new HttpRequestMessage(HttpMethod.Get, "http://localhost:12345"))
        );
        sw.Stop();

        var elapsedSeconds = sw.Elapsed.TotalSeconds;
        elapsedSeconds.Should().BeGreaterThan(14);
    }

    [Test]
    public async Task ShouldBeAbleToFetchFromGoogle()
    {
        var client = RetryHttpClientFactory.Create();

        var response = await client.GetAsync("https://www.google.com");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
