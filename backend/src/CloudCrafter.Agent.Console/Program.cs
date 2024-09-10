using System.CommandLine;
using CloudCrafter.Agent.Runner;
using CloudCrafter.Agent.Runner.Common.Behaviour;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.DeploymentLogPump.Implementation;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using CloudCrafter.Shared.Utils.Cli;
using CloudCrafter.Shared.Utils.Cli.Abstraction;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace CloudCrafter.Agent.Console;

public class Program
{
    public static async Task<int> Main(string[] args)
    {
        return await RunApp(args);
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

        var rootCommand = new RootCommand("CloudCrafter Agent");
        rootCommand.AddOption(demoOption);
        rootCommand.AddOption(fromBase64Option);
        rootCommand.AddOption(onlyDryRun);
        rootCommand.AddOption(generateSampleRecipe);

        int? resultCode = null;
        rootCommand.SetHandler(
            async (
                demoOptionValue,
                fromBase64OptionValue,
                onlyDryRunValue,
                generateSampleRecipeValue
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
                    }
                );
            },
            demoOption,
            fromBase64Option,
            onlyDryRun,
            generateSampleRecipe
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
