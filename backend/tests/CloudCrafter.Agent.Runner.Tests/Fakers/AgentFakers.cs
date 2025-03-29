﻿using Bogus;
using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Runner.Tests.Fakers;

public abstract class AgentFakers
{
    public static Faker<DeploymentRecipe> DeploymentRecipeFaker()
    {
        return new Faker<DeploymentRecipe>()
            .StrictMode(true)
            .RuleFor(x => x.Name, f => $"Application stack {f.Random.Number()}")
            .RuleFor(x => x.DockerComposeOptions, opt => null)
            .RuleFor(x => x.Application, f => DeploymentApplicationInfoFaker().Generate())
            .RuleFor(x => x.Destination, f => DeploymentRecipeDestinationFaker().Generate())
            .RuleFor(x => x.BuildOptions, f => DeploymentBuildOptionsFaker().Generate());
    }

    public static Faker<DeploymentRecipeDestination> DeploymentRecipeDestinationFaker()
    {
        return new Faker<DeploymentRecipeDestination>()
            .StrictMode(true)
            .RuleFor(x => x.RootDirectory, f => f.System.DirectoryPath())
            .RuleFor(x => x.GitCheckoutDirectory, f => f.System.DirectoryPath());
    }

    public static Faker<DeploymentBuildOptions> DeploymentBuildOptionsFaker()
    {
        return new Faker<DeploymentBuildOptions>()
            .StrictMode(true)
            .RuleFor(x => x.Steps, f => new List<DeploymentBuildStep>());
    }

    public static Faker<DeploymentRecipeApplicationInfo> DeploymentApplicationInfoFaker()
    {
        return new Faker<DeploymentRecipeApplicationInfo>()
            .StrictMode(true)
            .RuleFor(x => x.Id, f => f.Random.Guid());
    }
}
