using CloudCrafter.Agent.Console.IntegrationTests.Client;
using CloudCrafter.DockerCompose.Engine.Yaml;
using Docker.DotNet;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;

namespace CloudCrafter.Agent.Console.IntegrationTests;

public static class Helpers
{
    private static readonly DockerClient _client;
    public static IContainer? _nginxContainer;

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

    public static async Task RunNginx()
    {
        if (_nginxContainer != null)
        {
            throw new Exception("Nginx is already running");
        }


        _nginxContainer = new ContainerBuilder()
            .WithImage("nginx:latest")
            .WithName("my-custom-container")
            .WithPortBinding(8080, 80)
            .Build();

        await _nginxContainer.StartAsync();

        using var httpClient = new RetryHttpClient(5);

        var request = new HttpRequestMessage(HttpMethod.Get, "http://localhost:8080");

        var response = await httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception("Nginx did not became healthy");
        }
    }


    public static async Task RemoveNginx()
    {
        if (_nginxContainer == null)
        {
            throw new Exception("Nginx is never started");
        }

        await _nginxContainer.DisposeAsync();
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
