using CloudCrafter.DeploymentEngine.Engine.Brewery;
using FluentAssertions;
using NUnit.Framework;

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
        brewery.SetApplication(Guid.NewGuid());
        var act = () => brewery.Build();
        act.Should().Throw<InvalidOperationException>().WithMessage("Destination must be set.");
    }
}
