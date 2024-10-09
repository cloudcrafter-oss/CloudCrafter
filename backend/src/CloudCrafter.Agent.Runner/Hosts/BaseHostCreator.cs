using System.Reflection;
using CloudCrafter.Agent.Models.Configs;
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
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Sinks.SystemConsole.Themes;

namespace CloudCrafter.Agent.Runner.Hosts;

public class BaseHostCreator
{
    public static IHostBuilder CreateBuilder(string[] args, Assembly assembly)
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

                    services.AddTransient<ChannelIdEnricher>();
                    services.AddMediatR(cfg =>
                    {
                        cfg.RegisterServicesFromAssembly(assembly);
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

                    services.AddSingleton<IHubWrapper, HubWrapper>();
                    services.AddSingleton<HostInfoService>();
                    services.AddSingleton<IHubConnectionProvider, HubConnectionProvider>();

                    services.AddSerilog();

                    services
                        .AddOptions<AgentConfig>()
                        .BindConfiguration(AgentConfig.KEY)
                        .ValidateDataAnnotations()
                        .ValidateOnStart();
                }
            )
            .UseSerilog(
                (context, services, configuration) =>
                    configuration
                        .Enrich.FromLogContext()
                        .MinimumLevel.Debug()
                        // Add an instance of the enricher:
                        .Enrich.With(services.GetRequiredService<ChannelIdEnricher>())
                        .Enrich.FromLogContext()
                        .WriteTo.Console(theme: AnsiConsoleTheme.Code)
            );
    }
}
