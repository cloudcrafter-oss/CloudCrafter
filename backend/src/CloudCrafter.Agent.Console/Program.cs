using System.CommandLine;
using CloudCrafter.Agent.Console.Commands;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner;
using CloudCrafter.Agent.Runner.Cli;
using CloudCrafter.Agent.Runner.Cli.Helpers;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.DeploymentLogPump.Implementation;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

public class Program
{
    public static async Task<int> Main(string[] args)
    {
        return await RunApp(args);
    }

    public static async Task ValidateAndDeployRecipe(IHost host, DeploymentRecipe recipe)
    {
        var deploymentService = host.Services.GetRequiredService<DeploymentService>();

        await deploymentService.ValidateRecipe(recipe);

        await deploymentService.DeployAsync(recipe);
    }

    public static async Task<int> RunApp(string[] args)
    {
        var host = CreateHostBuilder(args).Build();

        var demoOption = new Option<bool>("--demo", "Runs the dummy deployment recipe");

        var rootCommand = new RootCommand("CloudCrafter Agent");
        rootCommand.AddOption(demoOption);

        int? exitCode = null;

        rootCommand.SetHandler(async demoOptionValue =>
        {
            var mediator = host.Services.GetRequiredService<IMediator>();

            var dockerHelper = host.Services.GetRequiredService<IDockerHelper>();

            var nginxResult = await dockerHelper.GetDockerContainer("c226748108c8");
            var frontendResult = await dockerHelper.GetDockerContainer("ccb67c7ba3ab");

            var healthCheckHelper = host.Services.GetRequiredService<IDockerHealthCheckHelper>();



            var testResult = await healthCheckHelper.IsHealthyAsync(nginxResult.ID, new()
            {
                CheckForDockerHealth = true,
                HttpMethod = "GET",
                HttpSchema = "http",
                HttpHost = "localhost",
                HttpPort = 80,
                HttpPath = "/",
                ExpectedResponseCode = 200
            });

            
            
            // var tester = host.Services.GetRequiredService<IDockerComposeHelper>();
            //
            // var testResult =
            //     await tester.GetDockerContainerIdForService(
            //         "/tmp/cloudcrafter-data/my-application/docker-compose.yml", "tester");
            //
            //
            //

            DeploymentRecipe? recipe = null;
            if (demoOptionValue)
            {
                var random = new Random();
                var randomString = new string(Enumerable.Repeat("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10)
                    .Select(s => s[random.Next(s.Length)]).ToArray());

                recipe = await mediator.Send(new GetDummyDeployment.Query("custom-image", randomString));
            }

            if (recipe == null)
            {
                exitCode = -1;
                Console.WriteLine("Error: No Recipe found - cannot continue");
                return;
            }

            await ValidateAndDeployRecipe(host, recipe);
        }, demoOption);


        var intResult = await rootCommand.InvokeAsync(args);

        return exitCode ?? intResult;
    }

    public static IHostBuilder CreateHostBuilder(string[] args)
    {
        return Host.CreateDefaultBuilder(args)
            .ConfigureServices((hostContext, services) =>
            {
                services.AddDeploymentStepsConfig();
                services.AddSingleton<IMessagePump, MessagePump>();
                services.AddTransient<ICommandExecutor, CommandExecutor>();
                services.AddSingleton<IDeploymentStepFactory, DeploymentStepFactory>();

                services.AddTransient<DeploymentService>();
                services.AddMediatR(cfg =>
                {
                    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
                    cfg.RegisterServicesFromAssembly(typeof(IAgentRunnerTarget).Assembly);
                });
            });
    }
}
