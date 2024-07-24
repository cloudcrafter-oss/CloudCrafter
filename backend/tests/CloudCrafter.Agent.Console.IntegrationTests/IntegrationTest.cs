using FluentAssertions;

namespace CloudCrafter.Agent.Console.IntegrationTests;

public class IntegrationTest
{
    [Test]
    public async Task ShouldNotBeAbletoDeployWithoutRecipe()
    {
        string[] args = [];

        var originalStream = System.Console.Out;
        using var sw = new StringWriter();
        System.Console.SetOut(sw);
        try
        {
            var exitCode = await Program.Main(args);

            exitCode.Should().Be(-1);

            var output = sw.ToString();
            output.Should().Contain("Error: No Recipe found - cannot continue");
        }
        finally
        {
            System.Console.SetOut(originalStream);
        }
    }
}
