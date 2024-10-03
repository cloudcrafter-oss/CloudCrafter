// using CloudCrafter.Agent.Models.Configs;
// using CloudCrafter.Agent.Models.SignalR;
// using CloudCrafter.Agent.Runner;
// using CloudCrafter.Agent.Runner.MediatR.SignalR;
// using CloudCrafter.Agent.Runner.SignalR;
// using CloudCrafter.Agent.Runner.SignalR.Providers;
// using CloudCrafter.Agent.SignalR;
// using MediatR;
// using Microsoft.AspNetCore.SignalR.Client;
// using Microsoft.Extensions.Logging;
// using Microsoft.Extensions.Options;
// using Moq;
//
// namespace CloudCrafter.Agent.Console.IntegrationTests.SignalR;
//
// public class SocketManagerTest
// {
//     [Test]
//     public async Task ReceiveAgentHubPingMessage_SendsToMediator()
//     {
//         // Arrange
//         var mockLogger = new Mock<ILogger<SocketManager>>();
//         var mockSender = new Mock<ISender>();
//         var mockConfig = new Mock<IOptions<AgentConfig>>();
//         mockConfig.Setup(x => x.Value).Returns(new AgentConfig
//         {
//             CloudCrafterHost = "http://test.com", ServerId = Guid.NewGuid(), AgentKey = "testKey"
//         });
//
//         var mockHubConnection = new Mock<HubConnection>(MockBehavior.Strict);
//         var mockHubConnectionObject = mockHubConnection.Object;
//         var mockHubConnectionProvider = new Mock<IHubConnectionProvider>();
//         mockHubConnectionProvider
//             .Setup(x => x.CreateConnection(It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<string>()))
//             .Returns(mockHubConnectionObject);
//
//         AgentHubPingMessage? capturedMessage = null;
//         TypedHubConnection<IAgentHub>? capturedConnection = null;
//
//         mockSender
//             .Setup(x => x.Send(It.IsAny<AgentHubPingMessageHandler.Query>(), It.IsAny<CancellationToken>()))
//             .Callback<IRequest<Unit>, CancellationToken>((query, token) =>
//             {
//                 var typedQuery = (AgentHubPingMessageHandler.Query)query;
//                 capturedMessage = typedQuery.Message;
//                 capturedConnection = typedQuery.TypedHubConnection;
//             });
//
//         // Act
//         var socketManager = new SocketManager(
//             mockLogger.Object,
//             mockSender.Object,
//             mockConfig.Object,
//             mockHubConnectionProvider.Object
//         );
//
//         // Simulate receiving a message
//         var testMessage = new AgentHubPingMessage { MessageId = Guid.NewGuid(), Timestamp = DateTime.UtcNow};
//         await mockHubConnection.RaiseAsync(
//             h => h.On<AgentHubPingMessage>("AgentHubPingMessage", It.IsAny<Action<AgentHubPingMessage>>()),
//             testMessage);
//
//         // Assert
//         mockSender.Verify(x => x.Send(It.IsAny<AgentHubPingMessageHandler.Query>(), It.IsAny<CancellationToken>()),
//             Times.Once);
//         capturedMessage.Should().NotBeNull();
//         capturedMessage!.MessageId.Should().NotBeEmpty();
//
//         capturedConnection.Should().NotBeNull();
//     }
// }
