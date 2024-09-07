using CloudCrafter.Agent.Console;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Runner.Factories;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps;

public abstract class BaseParameterConversionTest<T> where T : BaseParams
{
    public DeploymentStepSerializerFactory Serializer { get; set; }


    [OneTimeSetUp]
    public void SetUp()
    {
        var builder = Program.CreateHostBuilder([]);
        var host = builder.Build();
        Serializer = host.Services.GetRequiredService<DeploymentStepSerializerFactory>();
    }
}
