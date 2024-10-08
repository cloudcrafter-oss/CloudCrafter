﻿using CloudCrafter.Agent.Models.IO;
using CloudCrafter.DeploymentEngine.Engine.Brewery;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery;

public class RecipeBreweryTests
{
    [Test]
    public void ShouldBeAbleToCreateBrewery()
    {
        var brewery = new RecipeBrewery("Test");
        brewery.Should().NotBeNull();
    }

    [Test]
    public void ShouldNotBeAbleToBuildRecipeBecauseApplicationIsNotSet()
    {
        var brewery = new RecipeBrewery("Test");
        var act = () => brewery.Build();
        act.Should().Throw<InvalidOperationException>().WithMessage("Application must be set.");
    }

    [Test]
    public void ShouldNotBeAbleToBuildRecipeBecauseDestinationIsNotSet()
    {
        var brewery = new RecipeBrewery("Test");
        brewery.SetStackId(Guid.NewGuid());
        var act = () => brewery.Build();
        act.Should().Throw<InvalidOperationException>().WithMessage("Destination must be set.");
    }

    [Test]
    public async Task ShouldBeAbleToBuildRecipe()
    {
        var brewery = new RecipeBrewery("Test");
        var guid = Guid.Parse("f4ccb2c1-0ce2-4ea7-9129-9b6755a1fad2");
        brewery.SetStackId(guid);
        brewery.SetDestination("/var/data/cloudcrafter", $"/data/cloudcrafter/cc-{guid}");
        var recipe = brewery.Build();
        recipe.Should().NotBeNull();

        var recipeWriter = new YamlRecipeWriter(recipe);

        var yaml = recipeWriter.WriteString();

        await Verify(yaml);
    }
}
