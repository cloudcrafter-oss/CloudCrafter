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
}
