using CloudCrafter.Shared.Utils.Cli;
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

    [Test]
    public async Task ShouldBeAbleToExecuteNonExistingCommandStreaming()
    {
        var messages = new List<ExecutorStreamResult>();

        var result = await _executor.ExecuteWithStreamAsync("this-command-does-not-exists", ["-V"], streamResult =>
        {
            messages.Add(streamResult);
        });

        result.Should().NotBeNull();
        result.ExitCode.Should().Be(-1);
        result.IsSuccess.Should().Be(false);
        result.StdErr.Should().Be("Command not found: this-command-does-not-exists");
        messages.Should().BeEmpty();
    }


    [Test]
    public async Task ShouldBeAbleToExecuteExistingCommandStreaming()
    {
        var messages = new List<ExecutorStreamResult>();

        var result = await _executor.ExecuteWithStreamAsync("bash",
            new[] { "-c", "echo 'Hello, World!' && echo 'Error message' >&2" }, streamResult =>
            {
                messages.Add(streamResult);
            });

        result.Should().NotBeNull();
        result.ExitCode.Should().Be(0);
        result.IsSuccess.Should().BeTrue();

        messages.Should().HaveCount(2);

        var firstError = messages.FirstOrDefault(x => x.IsStdErr);
        firstError.Should().NotBeNull();
        firstError!.Log.Should().Be("Error message");

        var firstNonError = messages.FirstOrDefault(x => !x.IsStdErr);
        firstNonError.Should().NotBeNull();
        firstNonError!.Log.Should().Be("Hello, World!");

        result.StdErr.Should().Be("Error message\n");
        result.StdOut.Should().Be("Hello, World!\n");
    }
}
