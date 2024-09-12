using CloudCrafter.TestUtilities;
using DotNet.Testcontainers.Builders;

namespace CloudCrafter.E2E.Deployment;

[SetUpFixture]
public class GlobalSetup : SharedDockerTestHostSetup
{
    [OneTimeSetUp]
    public async Task SetupE2ETests()
    {
        await base.Setup();

        var solutionDirectory = GetSolutionDirectory();

        var agentDockerfileDirectory = Path.Combine(
            solutionDirectory,
            "src",
            "CloudCrafter.Agent.Console"
        );

        var agentFutureImage = new ImageFromDockerfileBuilder()
            .WithDockerfileDirectory(agentDockerfileDirectory)
            .WithDockerfile("Dockerfile")
            .Build();
    }
}
