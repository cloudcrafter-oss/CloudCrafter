using CloudCrafter.DockerCompose.Engine.Yaml;
using Docker.DotNet;


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

    public static DockerComposeEditor GetDummyEditor(string repository, string tag)
    {
        var editor = new DockerComposeEditor();
        var service = editor.AddService("web");

        service.SetImage(repository, tag);

        service.AddExposedPort(3000, 3000);

        return editor;
    }
}
