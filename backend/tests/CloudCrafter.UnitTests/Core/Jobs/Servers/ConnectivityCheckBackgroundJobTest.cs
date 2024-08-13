using CloudCrafter.Core.Interfaces.Domain.Servers;
using CloudCrafter.Core.Jobs.Servers;
using CloudCrafter.Domain.Entities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;

namespace CloudCrafter.UnitTests.Core.Jobs.Servers;

public class ConnectivityCheckBackgroundJobTest
{
    private Mock<IServerConnectivityService> _mockServerConnectivity;
    private ConnectivityCheckBackgroundJob _job;
    private Mock<ILoggerFactory> _mockLoggerFactory;

    [SetUp]
    public void Setup()
    {
        _mockServerConnectivity = new Mock<IServerConnectivityService>();
        _job = new ConnectivityCheckBackgroundJob(_mockServerConnectivity.Object);
        _mockLoggerFactory = new Mock<ILoggerFactory>();
        _mockLoggerFactory.Setup(x => x.CreateLogger(It.IsAny<string>()))
            .Returns(Mock.Of<ILogger<ConnectivityCheckBackgroundJob>>());
    }

    [Test]
    public void ExecuteAsync_NullServerConnectivityCheckJob_ThrowsArgumentException()
    {
        // Arrange
        var backgroundJob = new BackgroundJob
        {
            Id = Guid.NewGuid(),
            ServerConnectivityCheckJob = null,
            HangfireJobId = null,
            Type = BackgroundJobType.ServerConnectivityCheck,
            Status = BackgroundJobStatus.Enqueued,
            CreatedAt = DateTime.Today,
            UpdatedAt = DateTime.Today
        };
        var server = new Server
        {
            Id = Guid.NewGuid(),
            Name = "dummy",
            CreatedAt = DateTime.Now,
            IpAddress = "127.0.0.1",
            SshPort = 22,
            UpdatedAt = DateTime.Now
        };

        // Act & Assert
        var exception = Assert.ThrowsAsync<ArgumentException>(async () =>
            await _job.ExecuteAsync(backgroundJob, server, _mockLoggerFactory.Object));
        exception.Message.Should().Be("Background job is missing the ServerConnectivityCheckJob property.");
    }
}
