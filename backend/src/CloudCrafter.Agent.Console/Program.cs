using System.CommandLine;
using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Agent.Runner;
using CloudCrafter.Agent.Runner.Common.Behaviour;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.DeploymentLogPump.Implementation;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using CloudCrafter.Shared.Utils.Cli;
using CloudCrafter.Shared.Utils.Cli.Abstraction;
using MediatR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;

namespace CloudCrafter.Agent.Console;

public class Program
{
    public static async Task<int> Main(string[] args)
    {
        var host = CreateHostBuilder(args).Build();

        var logger = host.Services.GetRequiredService<ILogger<Program>>();

        var connection = new HubConnectionBuilder()
            .WithUrl(
                "http://web.127.0.0.1.sslip.io/hub/agent?agentId=ffcdd9ee-ff31-4344-a3ab-efdc9b5e44f1&agentKey=vHh7mZ5ntR"
            )
            .Build();

        connection.On<AgentHubPingMessage>(
            "AgentMessage",
            user =>
            {
                logger.LogInformation($"Received ID: {user.MessageId}");
            }
        );

        // Add a handler for the Closed event
        connection.Closed += error =>
        {
            if (error != null)
            {
                logger.LogCritical(error, "Connection closed due to an error");
            }
            else
            {
                logger.LogCritical("Connection closed by the CloudCrafter server");
            }

            Environment.Exit(1);
            return null;
        };

        try
        {
            logger.LogInformation("Attempting to open the connection to the CloudCrafter servers");
            await connection.StartAsync();
            logger.LogInformation(
                "Connected to the CloudCrafter servers. Listening for messages..."
            );
            // Keep the application running
            await Task.Delay(Timeout.Infinite);
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "Something went wrong during listening for messages");
            return 1;
        }

        return 0;
    }

    public static async Task<int> RunApp(string[] args)
    {
        var host = CreateHostBuilder(args).Build();

        var demoOption = new Option<bool>("--demo", "Runs the dummy deployment recipe 123");
        var fromBase64Option = new Option<string>(
            "--from-base64",
            "Runs the deployment recipe from a base64 string"
        );
        var onlyDryRun = new Option<bool>(
            "--dry-run",
            "Only runs the Agent in dry-run mode. Does not execute the actual recipe, but validates the recipe."
        );

        var generateSampleRecipe = new Option<bool>(
            "--generate-sample-recipe",
            "Generates a sample recipe and exits"
        );

        var recipePath = new Option<string>("--recipe", "Path to the recipe file");

        var rootCommand = new RootCommand("CloudCrafter Agent");
        rootCommand.AddOption(demoOption);
        rootCommand.AddOption(fromBase64Option);
        rootCommand.AddOption(onlyDryRun);
        rootCommand.AddOption(generateSampleRecipe);
        rootCommand.AddOption(recipePath);

        int? resultCode = null;
        rootCommand.SetHandler(
            async (
                demoOptionValue,
                fromBase64OptionValue,
                onlyDryRunValue,
                generateSampleRecipeValue,
                recipePathValue
            ) =>
            {
                var agentRunner = new AgentRunner(host);
                resultCode = await agentRunner.Run(
                    new AgentRunner.AgentRunnerArgs
                    {
                        UseDummyDeployment = demoOptionValue,
                        Base64Recipe = fromBase64OptionValue,
                        OnlyDryRun = onlyDryRunValue,
                        GenerateSampleRecipe = generateSampleRecipeValue,
                        RecipePath = recipePathValue,
                    }
                );
            },
            demoOption,
            fromBase64Option,
            onlyDryRun,
            generateSampleRecipe,
            recipePath
        );

        var intResult = await rootCommand.InvokeAsync(args);

        return resultCode ?? intResult;
    }

    public static IHostBuilder CreateHostBuilder(string[] args)
    {
        Log.Logger = new LoggerConfiguration().WriteTo.Console().CreateLogger();

        return Host.CreateDefaultBuilder(args)
            .ConfigureServices(
                (hostContext, services) =>
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

                        cfg.AddBehavior(
                            typeof(IPipelineBehavior<,>),
                            typeof(PerformanceBehaviour<,>)
                        );
                    });

                    services.AddSerilog();
                }
            );
    }
}
