﻿using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.DeploymentEngine.Engine.Brewery.Steps;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Engine.IntegrationTests.Brewery.Steps;

public class AlterNixpacksBuildPlanBuildStepGeneratorParameterConversionTest
    : BaseParameterConversionTest<NixpacksAlterPlanParams>
{
    [Test]
    public void ShouldBeAbleToCreateParams()
    {
        // Arrange
        var options = new AlterNixpacksBuildPlanBuildStepGeneratorParameterConversion.Args
        {
            AddPackages = new List<string> { "package1", "package2" },
        };
        var generator = new AlterNixpacksBuildPlanBuildStepGeneratorParameterConversion(options);

        // Act
        var buildStep = generator.Generate();

        // Assert
        var result = Serializer.GetConfig<NixpacksAlterPlanParams>(buildStep);
        var paramObject = Serializer.ConvertAndValidateParams(buildStep.Params, result.Validator);

        paramObject.Packages.Count().Should().Be(2);
        paramObject.Packages.Should().BeEquivalentTo("package1", "package2");
    }
}
