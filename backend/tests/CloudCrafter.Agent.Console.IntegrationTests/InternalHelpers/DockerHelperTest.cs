using CloudCrafter.Agent.Runner.Cli.Helpers;

namespace CloudCrafter.Agent.Console.IntegrationTests.InternalHelpers;

public class DockerHelperTest
{
    private DockerHelper _dockerHelper;

    [OneTimeSetUp]
    public async Task SetUp()
    {
        await RunNginx();

        _dockerHelper = new DockerHelper();
    }

    [OneTimeTearDown]
    public async Task TearDown()
    {
        await RemoveNginx();
    }

    [Test]
    public async Task ShouldBeAbleToRunCommandInContainer()
    {
        var nginxContainerId = _nginxContainer!.Id;

        await _dockerHelper.RunCommandInContainer(nginxContainerId!, "whoami", log =>
        {
            var std = log.IsStdOut ? "StdOut" : "StdErr";
            System.Console.WriteLine($"{std}: {log.Response}");
        });
    }
}
