using CloudCrafter.DeploymentEngine.Domain.Models;
using CloudCrafter.DeploymentEngine.Remote.Exceptions;
using CloudCrafter.DeploymentEngine.Remote.Manager;
using CloudCrafter.TestUtilities;
using FluentAssertions;

namespace CloudCrafter.DeploymentEngine.Remote.Tests;

[TestFixture]
public class CloudCraftManagerTest
{
    [SetUp]
    public void SetUp()
    {
        var sshKeyContents = File.ReadLines(
            SharedDockerTestHostSetup.TestHostDockerfileLocation! + "/id_rsa"
        );

        var sshKey = string.Join("\n", sshKeyContents);

        _engineServer = new EngineServerModel
        {
            Username = "root",
            Port = 2222, // TODO: Move this to random port as per the Testcontainer port
            Host = "localhost",
            SshKey = sshKey,
        };
    }

    private EngineServerModel _engineServer;

    [Test]
    public async Task ShouldBeAbleToRunCommandOnTestHost()
    {
        var manager = new CloudCrafterEngineManager(_engineServer);

        var client = manager.CreateSshClient();
        await client.ConnectAsync();

        var result = await client.ExecuteCommandAsync("whoami");

        result.Command.Should().Be("whoami");
        result.ExitStatus.Should().Be(0);
        result.Result.Should().Be("root");
        result.Error.Should().BeEmpty();
    }

    [Test]
    public async Task ShouldThrowExceptionWhenErrorHappens()
    {
        var manager = new CloudCrafterEngineManager(_engineServer);

        var client = manager.CreateSshClient();
        await client.ConnectAsync();

        Func<Task> act = async () =>
            await client.ExecuteCommandAsync("echo '' > /some/non/existing/directory/file.txt");

        var exception = await act.Should().ThrowAsync<CommandFailedException>();

        exception.Which.Command.Should().Be("echo '' > /some/non/existing/directory/file.txt");
        exception.Which.ExitCode.Should().Be(1);
        exception
            .Which.ErrorMessage.Should()
            .Be("sh: can't create /some/non/existing/directory/file.txt: nonexistent directory");
    }

    [Test]
    public async Task ShouldNotThrowExceptionWhenAllowedFailure()
    {
        var manager = new CloudCrafterEngineManager(_engineServer);

        var client = manager.CreateSshClient();
        await client.ConnectAsync();

        var result = await client.ExecuteCommandAsync(
            "echo '' > /some/non/existing/directory/file.txt",
            true
        );

        result.Command.Should().Be("echo '' > /some/non/existing/directory/file.txt");
        result.ExitStatus.Should().Be(1);
        result.Result.Should().BeEmpty();
        result
            .Error.Should()
            .Be("bash: line 1: /some/non/existing/directory/file.txt: No such file or directory");
    }
}
