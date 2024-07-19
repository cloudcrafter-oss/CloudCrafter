using CloudCrafter.Agent.Runner.Cli;
using FluentAssertions;

namespace CloudCrafter.Agent.Runner.Tests.Cli;

public class CommandExecutorTest
{
    private CommandExecutor _executor;

    [SetUp]
    public void Setup()
    {
        _executor = new CommandExecutor();
    }

    [Test]
    public async Task ShouldBeAbleToExecuteNonExisingCommand()
    {
        var result = await _executor.ExecuteAsync("this-command-does-not-exists", ["-V"]);

        result.Should().NotBeNull();

        result.ExitCode.Should().Be(-1);
        result.IsSuccess.Should().Be(false);
        result.StdErr.Should().Be("Command not found: this-command-does-not-exists");
    }

    [Test]
    public async Task ShouldBeAbleToGetGitVersion()
    {
        var result = await _executor.ExecuteAsync("git", ["-v"]);
        
        result.Should().NotBeNull();
        result.ExitCode.Should().Be(0);
        result.StdErr.Should().BeEmpty();
        result.StdOut.Should().StartWith("git version");
    }
}
