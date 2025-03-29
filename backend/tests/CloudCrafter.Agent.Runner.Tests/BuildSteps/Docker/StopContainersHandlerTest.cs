using CloudCrafter.Agent.Models.Deployment.Steps.Params.Container;
using CloudCrafter.Agent.Models.Docker;
using CloudCrafter.Agent.Models.Docker.Filters;
using CloudCrafter.Agent.Models.Recipe;
using CloudCrafter.Agent.Models.Runner;
using CloudCrafter.Agent.Runner.Cli.Helpers.Abstraction;
using CloudCrafter.Agent.Runner.DeploymentLogPump;
using CloudCrafter.Agent.Runner.RunnerEngine.Deployment.Steps.Container;
using Docker.DotNet.Models;
using FluentAssertions;
using Moq;

namespace CloudCrafter.Agent.Runner.Tests.BuildSteps.Docker;

public class StopContainersHandlerTest
    : BaseStepHandlerTest<StopContainersHandler, StopContainersParams>
{
    private Mock<IMessagePump> _mockPump;
    private Mock<IDockerHelper> _mockDockerHelper;
    private Mock<IDeploymentLogger> _mockLogger;
    private StopContainersHandler _handler;
    private DeploymentContext _context;

    [SetUp]
    public void Setup()
    {
        _mockPump = new Mock<IMessagePump>();
        _mockDockerHelper = new Mock<IDockerHelper>();
        _mockLogger = new Mock<IDeploymentLogger>();
        _mockPump
            .Setup(p => p.CreateLogger<ContainerHealthCheckHandler>())
            .Returns(_mockLogger.Object);

        _handler = new StopContainersHandler(_mockPump.Object, _mockDockerHelper.Object);
        _context = new DeploymentContext(GetTestRecipe());
    }

    [Test]
    public async Task ExecuteAsync_WithNoContainers_ShouldLogAndComplete()
    {
        // Arrange
        var parameters = new StopContainersParams
        {
            Filters = new Dictionary<string, List<string>>(),
            OnlyCloudCrafterContainers = false,
        };
        _mockDockerHelper
            .Setup(x => x.GetContainersFromFilter(It.IsAny<DockerContainerFilter>()))
            .ReturnsAsync(Array.Empty<ContainerListResponse>());

        // Act
        await _handler.ExecuteAsync(parameters, _context);

        // Assert
        _mockLogger.Verify(
            x => x.LogInfo("Stopping containers based on the provided filters"),
            Times.Once
        );
        _mockLogger.Verify(
            x => x.LogInfo("All containers stopped based on the provided filters"),
            Times.Once
        );
        _mockDockerHelper.Verify(x => x.StopContainers(It.IsAny<List<string>>()), Times.Never);
        _mockDockerHelper.Verify(x => x.RemoveContainers(It.IsAny<List<string>>()), Times.Never);
    }

    [Test]
    public async Task ExecuteAsync_WithContainers_ShouldStopAndRemoveThem()
    {
        // Arrange
        var parameters = new StopContainersParams
        {
            Filters = new Dictionary<string, List<string>>(),
            OnlyCloudCrafterContainers = false,
        };
        var containers = new[]
        {
            new ContainerListResponse { ID = "container1" },
            new ContainerListResponse { ID = "container2" },
        };
        _mockDockerHelper
            .Setup(x => x.GetContainersFromFilter(It.IsAny<DockerContainerFilter>()))
            .ReturnsAsync(containers);

        // Act
        await _handler.ExecuteAsync(parameters, _context);

        // Assert
        _mockLogger.Verify(x => x.LogInfo("Found 2 containers to stop and remove"), Times.Once);
        _mockDockerHelper.Verify(
            x => x.StopContainers(new List<string> { "container1", "container2" }),
            Times.Once
        );
        _mockDockerHelper.Verify(
            x => x.RemoveContainers(new List<string> { "container1", "container2" }),
            Times.Once
        );
    }

    [Test]
    public async Task ExecuteAsync_WithLabelFilters_ShouldApplyFilters()
    {
        // Arrange
        var parameters = new StopContainersParams
        {
            Filters = new Dictionary<string, List<string>>
            {
                {
                    "labels",
                    new List<string> { "app=test" }
                },
            },
            OnlyCloudCrafterContainers = false,
        };
        var containers = new[] { new ContainerListResponse { ID = "container1" } };
        _mockDockerHelper
            .Setup(x => x.GetContainersFromFilter(It.IsAny<DockerContainerFilter>()))
            .ReturnsAsync(containers);

        // Act
        await _handler.ExecuteAsync(parameters, _context);

        // Assert
        _mockDockerHelper.Verify(
            x =>
                x.GetContainersFromFilter(
                    It.Is<DockerContainerFilter>(f =>
                        f.LabelFilters.Any(l => l.Key == "app" && l.Value == "test")
                    )
                ),
            Times.Once
        );
    }

    [Test]
    public async Task ExecuteAsync_WithOnlyCloudCrafterContainers_ShouldSetFilter()
    {
        // Arrange
        var parameters = new StopContainersParams
        {
            Filters = new Dictionary<string, List<string>>(),
            OnlyCloudCrafterContainers = true,
        };
        var containers = new[] { new ContainerListResponse { ID = "container1" } };
        _mockDockerHelper
            .Setup(x => x.GetContainersFromFilter(It.IsAny<DockerContainerFilter>()))
            .ReturnsAsync(containers);

        // Act
        await _handler.ExecuteAsync(parameters, _context);

        // Assert
        _mockDockerHelper.Verify(
            x =>
                x.GetContainersFromFilter(
                    It.Is<DockerContainerFilter>(f => f.OnlyCloudCrafterLabels == true)
                ),
            Times.Once
        );
    }

    [Test]
    public async Task DryRun_ShouldLogAndCompleteWithoutStoppingContainers()
    {
        // Arrange
        var parameters = new StopContainersParams
        {
            Filters = new Dictionary<string, List<string>>(),
            OnlyCloudCrafterContainers = false,
        };

        // Act
        await _handler.DryRun(parameters, _context);

        // Assert
        _mockLogger.Verify(x => x.LogInfo("Stopping containers in dry run mode"), Times.Once);
        _mockDockerHelper.Verify(
            x => x.GetContainersFromFilter(It.IsAny<DockerContainerFilter>()),
            Times.Never
        );
        _mockDockerHelper.Verify(x => x.StopContainers(It.IsAny<List<string>>()), Times.Never);
        _mockDockerHelper.Verify(x => x.RemoveContainers(It.IsAny<List<string>>()), Times.Never);
    }
}
