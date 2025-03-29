using CloudCrafter.Agent.Models.Deployment.Steps.Params;
using CloudCrafter.Agent.Models.Exceptions;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps.GitCheckout;
using CloudCrafter.Agent.Runner.Tests.Fakers;
using CloudCrafter.Shared.Utils.Cli;
using CloudCrafter.Shared.Utils.Cli.Abstraction;
using FluentAssertions;
using Moq;

namespace CloudCrafter.Agent.Runner.Tests.BuildSteps.Source;

public class CheckoutGitRepositoryFromProviderStepHandlerTest
    : BaseStepHandlerTest<
        CheckoutGitRepositoryFromProviderStepHandler,
        GitCheckoutFromSourceProviderParams
    >
{
    private DeploymentContext _context;
    private CheckoutGitRepositoryFromProviderStepHandler _handler;
    private Mock<ICommandExecutor> _mockCommandExecutor;
    private Mock<IDeploymentLogger> _mockLogger;
    private Mock<IMessagePump> _mockPump;
    private const string GitDirectory = "/app/git";
    private const string GitCheckoutDirectory = "/app/git/git";

    [SetUp]
    public void Setup()
    {
        _mockPump = new Mock<IMessagePump>();
        _mockCommandExecutor = new Mock<ICommandExecutor>();
        _mockLogger = new Mock<IDeploymentLogger>();
        _mockPump
            .Setup(p => p.CreateLogger<CheckoutGitRepositoryFromProviderStepHandler>())
            .Returns(_mockLogger.Object);

        _handler = new CheckoutGitRepositoryFromProviderStepHandler(
            _mockPump.Object,
            _mockCommandExecutor.Object
        );

        // Get a base recipe
        var baseRecipe = GetTestRecipe();

        // Create a new recipe with the custom GitCheckoutDirectory
        var recipe = new DeploymentRecipe
        {
            Name = baseRecipe.Name,
            Application = baseRecipe.Application,
            EnvironmentVariables = baseRecipe.EnvironmentVariables,
            BuildOptions = baseRecipe.BuildOptions,
            Destination = new DeploymentRecipeDestination
            {
                GitCheckoutDirectory = GitDirectory,
                RootDirectory = baseRecipe.Destination.RootDirectory,
            },
        };

        _context = new DeploymentContext(recipe);
    }

    [Test]
    public async Task ExecuteAsync_ShouldCloneRepository_Successfully()
    {
        // Arrange
        var parameters = new GitCheckoutFromSourceProviderParams
        {
            FullPathWithToken = "https://token@github.com/user/repo.git",
            ProviderPath = "github.com/user/repo",
            Path = "user/repo",
            Branch = "main",
        };

        _mockCommandExecutor
            .Setup(c =>
                c.ExecuteAsync(
                    "git",
                    new[] { "clone", parameters.FullPathWithToken, GitCheckoutDirectory }
                )
            )
            .ReturnsAsync(new ExecutorResult { IsSuccess = true, ExitCode = 0 });

        // Act
        await _handler.ExecuteAsync(parameters, _context);

        // Assert
        _mockLogger.Verify(l => l.LogInfo("Start ExecuteAsync"), Times.Once);
        _mockLogger.Verify(
            l =>
                l.LogInfo(
                    $"Cloning repository {parameters.ProviderPath} to {GitCheckoutDirectory}"
                ),
            Times.Once
        );
        _mockCommandExecutor.Verify(
            c =>
                c.ExecuteAsync(
                    "git",
                    new[] { "clone", parameters.FullPathWithToken, GitCheckoutDirectory }
                ),
            Times.Once
        );
    }

    [Test]
    public void ExecuteAsync_ShouldThrowDeploymentException_WhenCloneFails()
    {
        // Arrange
        var parameters = new GitCheckoutFromSourceProviderParams
        {
            FullPathWithToken = "https://token@github.com/user/repo.git",
            ProviderPath = "github.com/user/repo",
            Path = "user/repo",
            Branch = "main",
        };

        _mockCommandExecutor
            .Setup(c =>
                c.ExecuteAsync(
                    "git",
                    new[] { "clone", parameters.FullPathWithToken, GitCheckoutDirectory }
                )
            )
            .ReturnsAsync(new ExecutorResult { IsSuccess = false, ExitCode = 1 });

        // Act & Assert
        _handler
            .Invoking(h => h.ExecuteAsync(parameters, _context))
            .Should()
            .ThrowAsync<DeploymentException>()
            .WithMessage("Failed to clone git repository");

        _mockLogger.Verify(l => l.LogCritical("Failed to clone git repository"), Times.Once);
    }

    [Test]
    public async Task DryRun_ShouldLogInfoMessage_AndNotExecuteCommand()
    {
        // Arrange
        var parameters = new GitCheckoutFromSourceProviderParams
        {
            FullPathWithToken = "https://token@github.com/user/repo.git",
            ProviderPath = "github.com/user/repo",
            Path = "user/repo",
            Branch = "main",
        };

        // Act
        await _handler.DryRun(parameters, _context);

        // Assert
        _mockLogger.Verify(
            l => l.LogInfo("Checkout Git Repository for Provider dryrun"),
            Times.Once
        );
        _mockCommandExecutor.Verify(
            c => c.ExecuteAsync(It.IsAny<string>(), It.IsAny<string[]>()),
            Times.Never
        );
    }

    [Test]
    public void Type_ShouldReturn_FetchGitRepositoryFromProviderType()
    {
        // Act & Assert
        _handler.Type.Should().Be(DeploymentBuildStepType.FetchGitRepositoryFromProvider);
    }

    [Test]
    public void Validator_ShouldNotBeNull()
    {
        // Act & Assert
        _handler.Validator.Should().NotBeNull();
    }
}
