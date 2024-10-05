using System.CommandLine;
using CloudCrafter.Agent.Models.Configs;
using CloudCrafter.Agent.Runner;
using CloudCrafter.Agent.Runner.Common.Behaviour;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.DeploymentLogPump.Implementation;
using CloudCrafter.Agent.Runner.Logging;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using CloudCrafter.Agent.Runner.Services;
using CloudCrafter.Agent.Runner.SignalR.Providers;
using CloudCrafter.Shared.Utils.Cli;
using CloudCrafter.Shared.Utils.Cli.Abstraction;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.EnvironmentVariables;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Serilog;

namespace CloudCrafter.Agent.Console;

public class Program
{
    public static async Task<int> Main(string[] args)
    {
        Log.Logger = AgentLoggerConfiguration.CreateConfiguration().CreateLogger();

        var host = CreateHostBuilder(args).Build();

        var logger = host.Services.GetRequiredService<ILogger<Program>>();

        var validator = host.Services.GetRequiredService<IStartupValidator>();
        validator.Validate();

        var manager = host.Services.GetRequiredService<SocketManager>();

        try
        {
            await manager.ConnectAsync();
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "Something went wrong, exiting...");
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
        return Host.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration(
                (hostingContext, config) =>
                {
                    config.Sources.Remove(
                        config.Sources.First(source =>
                            source.GetType() == typeof(EnvironmentVariablesConfigurationSource)
                        )
                    ); //remove the default one first
                    config.AddEnvironmentVariables("CLOUDCRAFTER_");
                }
            )
            .ConfigureServices(
                (hostContext, services) =>
                {
                    services.AddDeploymentStepsConfig();
                    services.AddSingleton<IMessagePump, MessagePump>();
                    services.AddTransient<ICommandExecutor, CommandExecutor>();
                    services.AddTransient<IHubWrapper, HubWrapper>();
                    services.AddSingleton<IDeploymentStepFactory, DeploymentStepFactory>();
                    services.AddScoped<SocketManager>();
                    services.AddTransient<DeploymentService>();
                    services.AddMediatR(cfg =>
                    {
                        cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
                        cfg.RegisterServicesFromAssembly(typeof(IAgentRunnerTarget).Assembly);

                        cfg.AddBehavior(
                            typeof(IPipelineBehavior<,>),
                            typeof(PerformanceBehaviour<,>)
                        );

                        cfg.AddBehavior(
                            typeof(IPipelineBehavior<,>),
                            typeof(AgentLoggingBehaviour<,>)
                        );
                    });
                    
                    
               
                    services.AddScoped<HubWrapper>();
                    services.AddSingleton<HostInfoService>();
                    services.AddSingleton<IHubConnectionProvider, HubConnectionProvider>();

                    services.AddSerilog();

                    services
                        .AddOptions<AgentConfig>()
                        .BindConfiguration(AgentConfig.KEY)
                        .ValidateDataAnnotations()
                        .ValidateOnStart();
                }
            );
    }
}
