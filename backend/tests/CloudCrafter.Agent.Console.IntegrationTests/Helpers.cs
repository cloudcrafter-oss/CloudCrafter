using CloudCrafter.DockerCompose.Engine.Yaml;
using Docker.DotNet;
using Docker.DotNet.Models;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using DotNet.Testcontainers.Images;

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

        try
        {
            _nginxContainer = new ContainerBuilder()
                .WithImage("nginx:latest")
                .WithName("my-custom-container")
                .WithPortBinding(8080, 80)
                .Build();

            await _nginxContainer.StartAsync();
            System.Console.WriteLine("Nginx is running");
        }
        catch (Exception ex)
        {
            System.Console.WriteLine(ex.Message);
            throw;
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
        using var client = new HttpClient();
        var response = await client.GetAsync(url);
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
