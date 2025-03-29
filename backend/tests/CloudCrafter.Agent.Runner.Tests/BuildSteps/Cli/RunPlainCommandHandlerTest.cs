using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps;
using CloudCrafter.Shared.Utils.Cli;
using CloudCrafter.Shared.Utils.Cli.Abstraction;
using FluentAssertions;
using Moq;

namespace CloudCrafter.Agent.Runner.Tests.BuildSteps.Cli;

public class RunPlainCommandHandlerTest
    : BaseStepHandlerTest<RunPlainCommandHandler, RunPlainCommandParams>
{
    private DeploymentContext _context;
    private RunPlainCommandHandler _handler;
    private Mock<ICommandExecutor> _mockCommandExecutor;
    private Mock<IDeploymentLogger> _mockLogger;
    private Mock<IMessagePump> _mockPump;

    [SetUp]
    public void Setup()
    {
        _mockPump = new Mock<IMessagePump>();
        _mockCommandExecutor = new Mock<ICommandExecutor>();
        _mockLogger = new Mock<IDeploymentLogger>();
        _mockPump.Setup(p => p.CreateLogger<RunPlainCommandHandler>()).Returns(_mockLogger.Object);

        _handler = new RunPlainCommandHandler(_mockPump.Object, _mockCommandExecutor.Object);
        _context = new DeploymentContext(GetTestRecipe());
    }

    [Test]
    public async Task ExecuteAsync_ShouldRunCommand_Successfully()
    {
        // Arrange
        var parameters = new RunPlainCommandParams
        {
            Command = "echo hello world",
            AllowFailure = false,
        };

        _mockCommandExecutor
            .Setup(c => c.ExecuteAsync("echo", new[] { "hello", "world" }))
            .ReturnsAsync(new ExecutorResult { IsSuccess = true });

        // Act
        await _handler.ExecuteAsync(parameters, _context);

        // Assert
        _mockLogger.Verify(
            l => l.LogInfo("Executing provided command: 'echo hello world'"),
            Times.Once
        );
        _mockLogger.Verify(l => l.LogInfo("Command: echo"), Times.Once);
        _mockLogger.Verify(l => l.LogInfo("Arguments: hello, world"), Times.Once);
        _mockLogger.Verify(l => l.LogInfo("Command executed successfully"), Times.Once);
        _mockCommandExecutor.Verify(
            c => c.ExecuteAsync("echo", new[] { "hello", "world" }),
            Times.Once
        );
    }

    [Test]
    public async Task ExecuteAsync_WithCommandWithoutArguments_ShouldRunSuccessfully()
    {
        // Arrange
        var parameters = new RunPlainCommandParams { Command = "ls", AllowFailure = false };

        _mockCommandExecutor
            .Setup(c => c.ExecuteAsync("ls", Array.Empty<string>()))
            .ReturnsAsync(new ExecutorResult { IsSuccess = true });

        // Act
        await _handler.ExecuteAsync(parameters, _context);

        // Assert
        _mockLogger.Verify(l => l.LogInfo("Executing provided command: 'ls'"), Times.Once);
        _mockLogger.Verify(l => l.LogInfo("Command: ls"), Times.Once);
        _mockLogger.Verify(l => l.LogInfo("Arguments: "), Times.Once);
        _mockCommandExecutor.Verify(c => c.ExecuteAsync("ls", Array.Empty<string>()), Times.Once);
    }

    [Test]
    public void ExecuteAsync_ShouldThrowException_WhenCommandFails_AndAllowFailureIsFalse()
    {
        // Arrange
        var parameters = new RunPlainCommandParams
        {
            Command = "invalid-command",
            AllowFailure = false,
        };

        var exception = new Exception("Command failed");
        _mockCommandExecutor
            .Setup(c => c.ExecuteAsync("invalid-command", Array.Empty<string>()))
            .ThrowsAsync(exception);

        // Act & Assert
        _handler
            .Invoking(h => h.ExecuteAsync(parameters, _context))
            .Should()
            .ThrowAsync<Exception>()
            .WithMessage("Command failed");

        _mockLogger.Verify(
            l => l.LogCritical("Command execution failed: Command failed"),
            Times.Once
        );
    }

    [Test]
    public async Task ExecuteAsync_ShouldNotThrowException_WhenCommandFails_AndAllowFailureIsTrue()
    {
        // Arrange
        var parameters = new RunPlainCommandParams
        {
            Command = "invalid-command",
            AllowFailure = true,
        };

        var exception = new Exception("Command failed");
        _mockCommandExecutor
            .Setup(c => c.ExecuteAsync("invalid-command", Array.Empty<string>()))
            .ThrowsAsync(exception);

        // Act
        await _handler.ExecuteAsync(parameters, _context);

        // Assert
        _mockLogger.Verify(
            l => l.LogCritical("Command execution failed: Command failed"),
            Times.Once
        );
        _mockLogger.Verify(
            l => l.LogInfo("Command execution failed but allowed to fail"),
            Times.Once
        );
    }

    [Test]
    public async Task DryRun_ShouldLogInfoMessage_AndNotExecuteCommand()
    {
        // Arrange
        var parameters = new RunPlainCommandParams
        {
            Command = "echo hello world",
            AllowFailure = false,
        };

        // Act
        await _handler.DryRun(parameters, _context);

        // Assert
        _mockLogger.Verify(l => l.LogInfo("Running plain command in dry run mode"), Times.Once);
        _mockCommandExecutor.Verify(
            c => c.ExecuteAsync(It.IsAny<string>(), It.IsAny<string[]>()),
            Times.Never
        );
    }

    [Test]
    public void Type_ShouldReturn_RunPlainCommandType()
    {
        // Act & Assert
        _handler.Type.Should().Be(DeploymentBuildStepType.RunPlainCommand);
    }

    [Test]
    public void Validator_ShouldNotBeNull()
    {
        // Act & Assert
        _handler.Validator.Should().NotBeNull();
    }
}
