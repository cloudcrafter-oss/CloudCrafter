using CloudCrafter.Agent.Models.Deployment.Steps.Params.EnvironmentFiles;
using CloudCrafter.Agent.Models.Exceptions;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Cli.Helpers.Abstraction;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps.EnvironmentVariables;
using FluentAssertions;
using Moq;

namespace CloudCrafter.Agent.Runner.Tests.BuildSteps.EnvironmentVariables;

public class WriteEnvironmentVariablesFileToFilesystemHandlerTest
    : BaseStepHandlerTest<
        WriteEnvironmentVariablesFileToFilesystemHandler,
        WriteEnvironmentVariablesFileToFilesystemParams
    >
{
    private DeploymentContext _context;
    private WriteEnvironmentVariablesFileToFilesystemHandler _handler;
    private Mock<IFileSystemHelper> _mockFileSystemHelper;
    private Mock<IDeploymentLogger> _mockLogger;
    private Mock<IMessagePump> _mockPump;
    private const string DockerComposeDirectory = "/app/docker";
    private const string FileName = ".env";
    private const string FileContents = "PORT=3000\nNODE_ENV=production";
    private const string FullPath = "/app/docker/.env";

    [SetUp]
    public void Setup()
    {
        _mockPump = new Mock<IMessagePump>();
        _mockFileSystemHelper = new Mock<IFileSystemHelper>();
        _mockLogger = new Mock<IDeploymentLogger>();
        _mockPump
            .Setup(p => p.CreateLogger<WriteEnvironmentVariablesFileToFilesystemHandler>())
            .Returns(_mockLogger.Object);

        _handler = new WriteEnvironmentVariablesFileToFilesystemHandler(
            _mockPump.Object,
            _mockFileSystemHelper.Object
        );

        // Get a base recipe and set up DockerComposeOptions
        var recipe = GetTestRecipe();
        recipe.DockerComposeOptions = new DeploymentRecipeDockerComposeOptions
        {
            DockerComposeDirectory = DockerComposeDirectory,
            Base64DockerCompose = "base64-encoded-content",
        };

        _context = new DeploymentContext(recipe);
    }

    [Test]
    public async Task ExecuteAsync_ShouldWriteEnvironmentVariablesFile_Successfully()
    {
        // Arrange
        var parameters = new WriteEnvironmentVariablesFileToFilesystemParams
        {
            FileName = FileName,
            FileContents = FileContents,
        };

        _mockFileSystemHelper
            .Setup(f => f.EnsureDirectoryExists(DockerComposeDirectory))
            .Returns(Task.CompletedTask);

        _mockFileSystemHelper
            .Setup(f => f.WriteFile(FullPath, FileContents))
            .Returns(Task.CompletedTask);

        // Act
        await _handler.ExecuteAsync(parameters, _context);

        // Assert
        _mockLogger.Verify(
            l => l.LogInfo("Writing environment variables to filesystem"),
            Times.Once
        );
        _mockFileSystemHelper.Verify(
            f => f.EnsureDirectoryExists(DockerComposeDirectory),
            Times.Once
        );
        _mockFileSystemHelper.Verify(f => f.WriteFile(FullPath, FileContents), Times.Once);
        _mockLogger.Verify(
            l => l.LogInfo($"Successfully wrote environment variables to {FullPath}"),
            Times.Once
        );
    }

    [Test]
    public void ExecuteAsync_ShouldThrowDeploymentException_WhenDockerComposeOptionsIsNull()
    {
        // Arrange
        var parameters = new WriteEnvironmentVariablesFileToFilesystemParams
        {
            FileName = FileName,
            FileContents = FileContents,
        };

        _context.Recipe.DockerComposeOptions = null;

        // Act & Assert
        _handler
            .Invoking(h => h.ExecuteAsync(parameters, _context))
            .Should()
            .ThrowAsync<DeploymentException>()
            .WithMessage(
                "Docker compose directory not found - cannot write environment variable file."
            );
    }

    [Test]
    public void ExecuteAsync_ShouldThrowDeploymentException_WhenDockerComposeDirectoryIsEmpty()
    {
        // Arrange
        var parameters = new WriteEnvironmentVariablesFileToFilesystemParams
        {
            FileName = FileName,
            FileContents = FileContents,
        };

        _context.Recipe.DockerComposeOptions = new DeploymentRecipeDockerComposeOptions
        {
            DockerComposeDirectory = string.Empty,
            Base64DockerCompose = "base64-encoded-content",
        };

        // Act & Assert
        _handler
            .Invoking(h => h.ExecuteAsync(parameters, _context))
            .Should()
            .ThrowAsync<DeploymentException>()
            .WithMessage(
                "Docker compose directory not found - cannot write environment variable file."
            );
    }

    [Test]
    public async Task DryRun_ShouldLogInfoMessage_AndNotWriteFile()
    {
        // Arrange
        var parameters = new WriteEnvironmentVariablesFileToFilesystemParams
        {
            FileName = FileName,
            FileContents = FileContents,
        };

        // Act
        await _handler.DryRun(parameters, _context);

        // Assert
        _mockLogger.Verify(
            l => l.LogInfo("Start dry run for WriteEnvironmentVariablesFileToFilesystemHandler"),
            Times.Once
        );
        _mockFileSystemHelper.Verify(f => f.EnsureDirectoryExists(It.IsAny<string>()), Times.Never);
        _mockFileSystemHelper.Verify(
            f => f.WriteFile(It.IsAny<string>(), It.IsAny<string>()),
            Times.Never
        );
    }

    [Test]
    public void Type_ShouldReturn_WriteEnvironmentVariablesFileToFilesystemType()
    {
        // Act & Assert
        _handler
            .Type.Should()
            .Be(DeploymentBuildStepType.WriteEnvironmentVariablesFileToFilesystem);
    }

    [Test]
    public void Validator_ShouldNotBeNull()
    {
        // Act & Assert
        _handler.Validator.Should().NotBeNull();
    }
}
