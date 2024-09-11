using CloudCrafter.DeploymentEngine.Domain.Models;
using CloudCrafter.DeploymentEngine.Remote.Manager;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Remote.Tests;

[TestFixture]
public class CloudCraftManagerTest
{
    private EngineServerModel _engineServer;

    [SetUp]
    public void SetUp()
    {
        var sshKeyContents = File.ReadLines(GlobalSetup.DockerFileLocation! + "/id_rsa");

        var sshKey = string.Join("\n", sshKeyContents);

        _engineServer = new EngineServerModel()
        {
            Username = "root",
            Port = 2222, // TODO: Move this to random port as per the Testcontainer port
            Host = "localhost",
            SshKey = sshKey,
        };
    }

    [Test]
    public async Task ShouldBeAbleToRunCommandOnTestHost()
    {
        var manager = new CloudCrafterEngineManager(_engineServer);

        var client = manager.CreateSshClient();
        await client.ConnectAsync();

        var result = await client.ExecuteCommandAsync("whoami");

        result.Command.Should().Be("whoami");
        result.ExitStatus.Should().Be(0);
        result.Result.Should().Be("root\n");
    }
}
