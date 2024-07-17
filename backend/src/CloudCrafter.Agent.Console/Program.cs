﻿using CloudCrafter.Agent.Console.Commands;

using CloudCrafter.Agent.Models.Deployment;
using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner;
using CloudCrafter.Agent.Runner.Cli;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.DeploymentLogPump.Implementation;
using CloudCrafter.Agent.Runner.IO;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps;
using CloudCrafter.Agent.Runner.Validators;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

static IHostBuilder CreateHostBuilder(string[] args)
{
    return Host.CreateDefaultBuilder(args)
        .ConfigureServices((hostContext, services) =>
        {
          
            services.AddTransient<IDeploymentStepHandler<GitCheckoutParams>, CheckoutGitRepositoryStepHandler>();
            services.AddTransient<IDeploymentStepConfig<GitCheckoutParams>, GitCheckoutConfig>();
            
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


var host = CreateHostBuilder(args).Build();

var mediator = host.Services.GetRequiredService<IMediator>();

var recipe = await mediator.Send(new GetDummyDeployment.Query());
var deploymentService = host.Services.GetRequiredService<DeploymentService>();

await deploymentService.DeployAsync(recipe);

var writer = new YamlRecipeWriter(recipe);

var yaml = writer.WriteString();
Console.Write(yaml);
var pump = host.Services.GetRequiredService<IMessagePump>();
