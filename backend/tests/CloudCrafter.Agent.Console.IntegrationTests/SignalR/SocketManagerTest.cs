// using CloudCrafter.Agent.Models.Configs;
// using CloudCrafter.Agent.Models.SignalR;
// using CloudCrafter.Agent.Runner;
// using CloudCrafter.Agent.Runner.MediatR.SignalR;
// using CloudCrafter.Agent.Runner.SignalR;
// using CloudCrafter.Agent.Runner.SignalR.Providers;
// using CloudCrafter.Agent.SignalR;
// using MediatR;
// using Microsoft.Extensions.Logging;
// using Microsoft.Extensions.Options;
// using Moq;
//
// namespace CloudCrafter.Agent.Console.IntegrationTests.SignalR;
//
// public class SocketManagerTest
// {
//     private Mock<ILogger<SocketManager>> _loggerMock;
//     private Mock<ISender> _senderMock;
//     private Mock<IOptions<AgentConfig>> _configMock;
//     private Mock<IHubWrapper> _hubWrapperMock;
//     private SocketManager _socketManager;
//
//     [SetUp]
//     public void Setup()
//     {
//         _loggerMock = new Mock<ILogger<SocketManager>>();
//         _senderMock = new Mock<ISender>();
//         _configMock = new Mock<IOptions<AgentConfig>>();
//         _hubWrapperMock = new Mock<IHubWrapper>();
//
//         _configMock.Setup(c => c.Value).Returns(new AgentConfig { AgentKey = "dummy", ServerId = Guid.NewGuid(), CloudCrafterHost = "http://localhost" });
//
//         _socketManager = new SocketManager(
//             _loggerMock.Object,
//             _senderMock.Object,
//             _configMock.Object,
//             _hubWrapperMock.Object
//         );
//     }
//
//     [Test]
//     public void AttachMessageHandlers_ShouldAttachHandlers()
//     {
//         // Arrange
//         var pingMessage = new AgentHubPingMessage() { Timestamp = DateTime.UtcNow, MessageId = Guid.NewGuid() };
//
//         // Act
//
//         _hubWrapperMock.Raise(
//             h => h.On<AgentHubPingMessage>("Test", It.IsAny<Func<AgentHubPingMessage, Task>>()),
//             pingMessage);
//
//
//         // Assert
//         _senderMock.Verify(s => s.Send(It.IsAny<AgentHubPingMessageHandler.Query>(), default), Times.Once);
//     }
//
//     private class DummyMock<TMessage> : IHubWrapper
//     {
//         public DummyMock(Func<TMessage, Task> handler)
//         {
//                 _handler = handler
//         }
//
//         public TypedHubConnection<IAgentHub> TypedHubConnection { get; }
//         public void AttachEvents()
//         {
//             throw new NotImplementedException();
//         }
//
//         public void On<TMessage>(string methodName, Func<TMessage, Task> handler)
//         {
//             throw new NotImplementedException();
//         }
//
//         public Task StartAsync()
//         {
//             throw new NotImplementedException();
//         }
//     }
// }
