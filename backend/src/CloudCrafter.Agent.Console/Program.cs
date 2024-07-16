// See https://aka.ms/new-console-template for more information

using CloudCrafter.Agent.Console.Commands;
using CloudCrafter.Agent.Console.Commands.Runner;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Runner.IO;
using CloudCrafter.Agent.Runner.RunnerEngine;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureServices((hostContext, services) =>
        {
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));
            // Register your handlers here
        });


var host = CreateHostBuilder(args).Build();

var mediator = host.Services.GetRequiredService<IMediator>();

var recipe = await mediator.Send(new GetDummyDeployment.Query());
var runner = await mediator.Send(new CreateRunnerCommand.Query(recipe));


var writer = new YamlRecipeWriter(recipe);

Console.Write(writer.WriteString());


