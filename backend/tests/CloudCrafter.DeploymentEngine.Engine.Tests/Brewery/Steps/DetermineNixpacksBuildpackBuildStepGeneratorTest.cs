﻿using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.Tests.Brewery.Steps;

public class DetermineNixpacksBuildpackBuildStepGeneratorTest
{
    [Test]
    public void ShouldBeAbleToGenerateBuildStep()
    {
        // Arrange
        var options = new DetermineNixpacksBuildpackBuildStepGenerator.Args { Path = "relative-path" };
        var generator = new DetermineNixpacksBuildpackBuildStepGenerator(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        buildStep.Type.Should().Be(DeploymentBuildStepType.NixpacksDetermineBuildPack);
        buildStep.Params.Should().ContainKey("path");
        buildStep.Params["path"].Should().Be("relative-path");
    }
}