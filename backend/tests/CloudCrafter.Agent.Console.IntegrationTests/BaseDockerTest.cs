using CloudCrafter.Shared.Utils.Http;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;

namespace CloudCrafter.Agent.Console.IntegrationTests;

public abstract class BaseDockerTest
{
    private IContainer? _nginxContainer;

    [OneTimeSetUp]
    public async Task OneTimeSetup()
    {
        try
        {
            await RunNginx();
        }
        catch (Exception ex)
        {
            System.Console.WriteLine(ex.Message);
            throw;
        }
    }

    [OneTimeTearDown]
    public async Task TearDown()
    {
        await RemoveNginx();
    }

    private async Task RunNginx()
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

        var client = RetryHttpClientFactory.Create();

        var request = new HttpRequestMessage(HttpMethod.Get, "http://localhost:8080");

        var response = await client.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception("Nginx did not became healthy");
        }
    }

    protected string GetNginxContainerId()
    {
        if (_nginxContainer == null)
        {
            throw new Exception("Nginx is never started");
        }

        return _nginxContainer.Id;
    }


    private async Task RemoveNginx()
    {
        if (_nginxContainer == null)
        {
            throw new Exception("Nginx is never started");
        }

        await _nginxContainer.DisposeAsync();
    }
}
