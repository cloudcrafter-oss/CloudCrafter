using CloudCrafter.Agent.Console.IntegrationTests.Client;
using CloudCrafter.DockerCompose.Engine.Yaml;
using Docker.DotNet;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;

namespace CloudCrafter.Agent.Console.IntegrationTests;

public static class Helpers
{
    private static readonly DockerClient _client;
    static Helpers()
    {
        _client = new DockerClientConfiguration()
            .CreateClient();
    }

    public static async Task ShouldHaveDockerImage(string image)
    {
        var result = await _client.Images
            .InspectImageAsync(image);

        result.Should().NotBeNull();
    }

  

    public static async Task ShouldHaveEndpointResponse(string url, string responseContains, int statusCode = 200)
    {
        using var client = new RetryHttpClient(5);
        var request = new HttpRequestMessage(HttpMethod.Get, url);

        var response = await client.SendAsync(request);
        ((int)response.StatusCode).Should().Be(statusCode);
        var content = await response.Content.ReadAsStringAsync();

        content.Should().Contain(responseContains);
    }

    public static DockerComposeEditor GetDummyEditor(string repository, string tag)
    {
        var editor = new DockerComposeEditor();
        var service = editor.AddService("web");

        service.SetImage(repository, tag);

        service.AddExposedPort(3000, 3000);

        return editor;
    }
}
