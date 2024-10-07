using CloudCrafter.Agent.Models.Configs;
using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Agent.Runner;
using CloudCrafter.Agent.Runner.MediatR.SignalR;
using CloudCrafter.Agent.Runner.SignalR.Providers;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;

namespace CloudCrafter.Agent.Console.IntegrationTests.SignalR;

public class SocketManagerTest
{
    private Mock<ILogger<SocketManager>> _loggerMock;
    private Mock<ISender> _senderMock;
    private Mock<IOptions<AgentConfig>> _configMock;
    private HubWrapperMockSetup _hubWrapper;
    private SocketManager _socketManager;

    [SetUp]
    public void Setup()
    {
        _loggerMock = new Mock<ILogger<SocketManager>>();
        _senderMock = new Mock<ISender>();
        _configMock = new Mock<IOptions<AgentConfig>>();
        _hubWrapper = new();

        _configMock
            .Setup(c => c.Value)
            .Returns(
                new AgentConfig
                {
                    AgentKey = "dummy",
                    ServerId = Guid.NewGuid(),
                    CloudCrafterHost = "http://localhost",
                }
            );

        _socketManager = new SocketManager(
            _loggerMock.Object,
            _senderMock.Object,
            _configMock.Object,
            _hubWrapper.Object
        );
    }

    [Test]
    public async Task AttachMessageHandlers_ShouldAttachHandlers()
    {
        // Arrange
        var pingMessage = new AgentHubPingMessage()
        {
            Timestamp = DateTime.UtcNow,
            MessageId = Guid.NewGuid(),
        };

        // Act
        await _hubWrapper.RaiseEventAsync(nameof(AgentHubPingMessage), pingMessage);

        // Assert
        _senderMock.Verify(
            s => s.Send(It.IsAny<AgentHubPingMessageHandler.Query>(), default),
            Times.Once
        );
    }

    private class HubWrapperMockSetup
    {
        private readonly Mock<IHubWrapper> _mockHubWrapper;
        private readonly Dictionary<string, List<Delegate>> _eventHandlers = [];

        public HubWrapperMockSetup()
        {
            _mockHubWrapper = new Mock<IHubWrapper>();

            _mockHubWrapper
                .Setup(m => m.On(It.IsAny<string>(), It.IsAny<Func<It.IsAnyType, Task>>()))
                .Callback<string, Delegate>(
                    (methodName, handler) =>
                    {
                        if (!_eventHandlers.TryGetValue(methodName, out var value))
                        {
                            value = [];
                            _eventHandlers[methodName] = value;
                        }

                        value.Add(handler);
                    }
                );
        }

        public IHubWrapper Object => _mockHubWrapper.Object;

        public async Task RaiseEventAsync<TMessage>(string methodName, TMessage message)
        {
            if (_eventHandlers.TryGetValue(methodName, out var handlers))
            {
                foreach (var handler in handlers)
                {
                    if (handler is Func<TMessage, Task> typedHandler)
                    {
                        await typedHandler(message);
                    }
                }
            }
        }
    }
}
