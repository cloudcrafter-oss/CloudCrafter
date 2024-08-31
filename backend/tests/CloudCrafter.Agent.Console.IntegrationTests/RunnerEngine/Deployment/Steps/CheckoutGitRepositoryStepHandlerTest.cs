using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Exceptions;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps;
using CloudCrafter.Shared.Utils.Cli.Abstraction;
using Microsoft.Extensions.DependencyInjection;

namespace CloudCrafter.Agent.Console.IntegrationTests.RunnerEngine.Deployment.Steps;

public class CheckoutGitRepositoryStepHandlerTest : HandlerBaseCase
{
    private CheckoutGitRepositoryStepHandler _handler;

    [SetUp]
    public void Setup()
    {
        var builder = Program.CreateHostBuilder([]);
        var host = builder.Build();

        var pump = host.Services.GetRequiredService<IMessagePump>();
        var executor = host.Services.GetRequiredService<ICommandExecutor>();

        _handler = new CheckoutGitRepositoryStepHandler(pump, executor);
    }

    [Test]
    public async Task ShouldBeAbleToExecuteFine()
    {
        var checkoutParams = new GitCheckoutParams { Repo = "https://github.com/cloudcrafter-oss/demo-examples.git" };

        var context = GetContext();

        await _handler.ExecuteAsync(checkoutParams, context);

        // Should not throw an exception
        true.Should().BeTrue();
    }

    [Test]
    public void ShouldThrowDeploymentExceptionBecauseGitRepositoryIsNotCorrect()
    {
        var checkoutParams = new GitCheckoutParams { Repo = "https://github.com/cloudcrafter-oss/not-found.git" };

        var context = GetContext();

        var exception = Assert.ThrowsAsync<DeploymentException>(() => _handler.ExecuteAsync(checkoutParams, context));

        exception.Message.Should().Be("Failed to clone git repository");
    }
}
