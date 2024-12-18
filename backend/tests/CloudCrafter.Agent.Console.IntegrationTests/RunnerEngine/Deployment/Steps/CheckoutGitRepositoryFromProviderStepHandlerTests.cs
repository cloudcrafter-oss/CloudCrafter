using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Exceptions;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps.GitCheckout;
using CloudCrafter.Shared.Utils.Cli;
using CloudCrafter.Shared.Utils.Cli.Abstraction;
using FluentAssertions;
using Moq;

namespace CloudCrafter.Agent.Console.IntegrationTests.RunnerEngine.Deployment.Steps;

public class CheckoutGitRepositoryFromProviderStepHandlerTests : HandlerBaseCase
{
    private Mock<IMessagePump> _messagePumpMock;
    private Mock<ICommandExecutor> _commandExecutorMock;
    private Mock<IDeploymentLogger> _loggerMock;
    private CheckoutGitRepositoryFromProviderStepHandler _handler;

    [SetUp]
    public void SetupCheckoutGitRepositoryFromProviderStepHandlerTests()
    {
        _messagePumpMock = new Mock<IMessagePump>();
        _commandExecutorMock = new Mock<ICommandExecutor>();
        _loggerMock = new Mock<IDeploymentLogger>();

        _messagePumpMock
            .Setup(x => x.CreateLogger<CheckoutGitRepositoryFromProviderStepHandler>())
            .Returns(_loggerMock.Object);

        _handler = new CheckoutGitRepositoryFromProviderStepHandler(
            _messagePumpMock.Object,
            _commandExecutorMock.Object
        );
    }

    [Test]
    public void Type_ShouldReturnCorrectDeploymentBuildStepType()
    {
        // Act
        var result = _handler.Type;

        // Assert
        result.Should().Be(DeploymentBuildStepType.FetchGitRepositoryFromProvider);
    }

    [Test]
    public async Task ExecuteAsync_SuccessfulGitClone_ShouldCompleteWithoutException()
    {
        // Arrange
        var parameters = new GitCheckoutFromSourceProviderParams
        {
            ProviderPath = "https://github.com/test/repo",
            FullPathWithToken = "https://token@github.com/test/repo",
        };

        var context = GetContext();
        var gitDirectory = context.GetGitDirectory();
        var expectedGitCheckoutDirectory = $"{gitDirectory}/git";

        _commandExecutorMock
            .Setup(x =>
                x.ExecuteAsync(
                    "git",
                    It.Is<IEnumerable<string>>(args =>
                        args.SequenceEqual(
                            new[]
                            {
                                "clone",
                                parameters.FullPathWithToken,
                                expectedGitCheckoutDirectory,
                            }
                        )
                    )
                )
            )
            .ReturnsAsync(new ExecutorResult { ExitCode = 0, StdOut = string.Empty });

        // Act
        await _handler.ExecuteAsync(parameters, context);

        // Assert
        _loggerMock.Verify(x => x.LogInfo("Start ExecuteAsync"), Times.Once);
        _loggerMock.Verify(
            x =>
                x.LogInfo(
                    $"Cloning repository {parameters.ProviderPath} to {expectedGitCheckoutDirectory}"
                ),
            Times.Once
        );
        _commandExecutorMock.Verify(
            x =>
                x.ExecuteAsync(
                    "git",
                    It.Is<IEnumerable<string>>(args =>
                        args.SequenceEqual(
                            new[]
                            {
                                "clone",
                                parameters.FullPathWithToken,
                                expectedGitCheckoutDirectory,
                            }
                        )
                    )
                ),
            Times.Once
        );
    }

    [Test]
    public void ExecuteAsync_FailedGitClone_ShouldThrowDeploymentException()
    {
        // Arrange
        var parameters = new GitCheckoutFromSourceProviderParams
        {
            ProviderPath = "https://github.com/test/repo",
            FullPathWithToken = "https://token@github.com/test/repo",
        };

        var context = GetContext();

        _commandExecutorMock
            .Setup(x => x.ExecuteAsync("git", It.IsAny<IEnumerable<string>>()))
            .ReturnsAsync(new ExecutorResult { ExitCode = 1, StdOut = "Error cloning repository" });

        // Act & Assert
        Assert.ThrowsAsync<DeploymentException>(() => _handler.ExecuteAsync(parameters, context));

        _loggerMock.Verify(x => x.LogCritical("Failed to clone git repository"), Times.Once);
    }

    [Test]
    public async Task DryRun_ShouldLogAndComplete()
    {
        // Arrange
        var parameters = new GitCheckoutFromSourceProviderParams
        {
            ProviderPath = "https://github.com/test/repo",
            FullPathWithToken = "https://token@github.com/test/repo",
        };
        var context = GetContext();

        // Act
        await _handler.DryRun(parameters, context);

        // Assert
        _loggerMock.Verify(
            x => x.LogInfo("Checkout Git Repository for Provider dryrun"),
            Times.Once
        );
    }
}
