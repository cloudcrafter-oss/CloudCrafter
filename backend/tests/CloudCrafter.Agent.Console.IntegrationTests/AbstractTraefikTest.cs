using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;

namespace CloudCrafter.Agent.Console.IntegrationTests;

public abstract class AbstractTraefikTest
{
    protected IContainer TraefikContainer { get; private set; }
 
    [OneTimeSetUp]
    public async Task Setup()
    {
        await EnsureNetworkExists("cloudcrafter");
        TraefikContainer = new ContainerBuilder()
            .WithImage("traefik:v3.1")
            .WithPortBinding(8888, 80)
            .WithCommand(
                "--api.insecure=true",
                "--providers.docker=true",
                "--providers.docker.exposedbydefault=false",
                "--entrypoints.web.address=:80"
            )
            .WithNetwork("cloudcrafter")
            .WithEnvironment("DOCKER_HOST", "unix:///var/run/docker.sock")
            .WithBindMount("/var/run/docker.sock","/var/run/docker.sock")
            .Build();

        await TraefikContainer.StartAsync();
        
        await ShouldHaveEndpointResponse("http://localhost:8888", "404 page not found", 404);
    }
    
    [OneTimeTearDown]
    public async Task TearDown()
    {
        if (TraefikContainer != null)
        {
            await TraefikContainer.StopAsync();
            await TraefikContainer.DisposeAsync();
        }
    }
}
