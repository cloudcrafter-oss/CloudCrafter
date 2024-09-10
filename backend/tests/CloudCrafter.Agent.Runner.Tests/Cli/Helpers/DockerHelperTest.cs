using CloudCrafter.Agent.Models.Docker.Filters;
using CloudCrafter.Agent.Runner.Cli.Helpers;
using CloudCrafter.Agent.Runner.Cli.Helpers.Abstraction;
using CloudCrafter.DockerCompose.Shared.Labels;
using CloudCrafter.Shared.Deployment.Docker.Labels;
using Docker.DotNet;
using Docker.DotNet.Models;
using FluentAssertions;
using Moq;

namespace CloudCrafter.Agent.Runner.Tests.Cli.Helpers;

public class DockerHelperTest
{
    private Mock<IDockerClientProvider> _mockProvider;
    private Mock<IDockerClient> _mockClient;
    private Mock<IContainerOperations> _mockContainerOperations;
    private DockerHelper _dockerHelper;

    [SetUp]
    public void Setup()
    {
        _mockProvider = new Mock<IDockerClientProvider>();
        _mockClient = new Mock<IDockerClient>();
        _mockContainerOperations = new Mock<IContainerOperations>();

        _mockClient.Setup(c => c.Containers).Returns(_mockContainerOperations.Object);
        _mockProvider.Setup(p => p.GetClient()).Returns(_mockClient.Object);

        _dockerHelper = new DockerHelper(_mockProvider.Object);
    }

    [Test]
    public async Task GetContainersFromFilter_WithOnlyCloudCrafterLabels_ReturnsFilteredContainers()
    {
        // Arrange
        var filter = new DockerContainerFilter { OnlyCloudCrafterLabels = true };
        var expectedContainers = new List<ContainerListResponse>
        {
            new ContainerListResponse
            {
                ID = "container1",
                Labels = new Dictionary<string, string>
                {
                    { CloudCrafterLabelKeys.CloudCrafterManaged, "true" },
                },
            },
        };

        _mockContainerOperations
            .Setup(c => c.ListContainersAsync(It.IsAny<ContainersListParameters>(), default))
            .ReturnsAsync(expectedContainers);

        // Act
        var result = await _dockerHelper.GetContainersFromFilter(filter);

        // Assert
        Assert.That(result, Is.EqualTo(expectedContainers));
        _mockContainerOperations.Verify(
            c =>
                c.ListContainersAsync(
                    It.Is<ContainersListParameters>(p =>
                        p.All == true
                        && p.Filters.ContainsKey("label")
                        && p.Filters["label"].ContainsKey(CloudCrafterLabelKeys.CloudCrafterManaged)
                    ),
                    default
                ),
            Times.Once
        );
    }

    [Test]
    public async Task GetContainersFromFilter_WithLabelFilters_ReturnsFilteredContainers()
    {
        // Arrange
        var filter = new DockerContainerFilter
        {
            LabelFilters = new List<DockerLabelFilter>
            {
                DockerLabelFilter.Parse("test.label=value1"),
            },
        };
        var allContainers = new List<ContainerListResponse>
        {
            new ContainerListResponse
            {
                ID = "container1",
                Labels = new Dictionary<string, string> { { "test.label", "value1" } },
            },
            new ContainerListResponse
            {
                ID = "container2",
                Labels = new Dictionary<string, string> { { "test.label", "value2" } },
            },
        };

        _mockContainerOperations
            .Setup(c => c.ListContainersAsync(It.IsAny<ContainersListParameters>(), default))
            .ReturnsAsync(allContainers);

        // Act
        var result = await _dockerHelper.GetContainersFromFilter(filter);

        // Assert
        Assert.That(result.Count, Is.EqualTo(1));
        Assert.That(result[0].ID, Is.EqualTo("container1"));
    }

    [Test]
    public async Task GetContainersFromFilter_WithNoFilters_ReturnsAllContainers()
    {
        // Arrange
        var filter = new DockerContainerFilter();
        var allContainers = new List<ContainerListResponse>
        {
            new ContainerListResponse { ID = "container1" },
            new ContainerListResponse { ID = "container2" },
        };

        _mockContainerOperations
            .Setup(c => c.ListContainersAsync(It.IsAny<ContainersListParameters>(), default))
            .ReturnsAsync(allContainers);

        // Act
        var result = await _dockerHelper.GetContainersFromFilter(filter);

        // Assert
        Assert.That(result, Is.EqualTo(allContainers));
    }
}
