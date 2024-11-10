// using CloudCrafter.Core.Commands.Stacks;
// using CloudCrafter.Core.Interfaces;
// using CloudCrafter.Core.Jobs.Dispatcher;
// using Moq;
// using FluentAssertions;
// using NUnit.Framework;
//
// namespace CloudCrafter.FunctionalTests.Domain.Stacks;
//
// using static Testing;
//
// public class DispatchStackDeploymentTest : BaseTestFixture
// {
//     private Mock<ICloudCrafterDispatcher> _mockDispatcher = new();
//
//     [SetUp]
//     public void Setup()
//     {
//         _mockDispatcher = new Mock<ICloudCrafterDispatcher>();
//         CustomWebApplicationFactory.ReplaceService<ICloudCrafterDispatcher>(_mockDispatcher.Object);
//     }
//
//     [Test]
//     public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
//     {
//         Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
//             await SendAsync(new DispatchStackDeployment.Command(Guid.NewGuid())));
//     }
//
//     [Test]
//     public async Task ShoulThrowErrorWhenNoAccessBecauseItDoesNotExists()
//     {
//         await RunAsAdministratorAsync();
//
//         var stackId = Guid.NewGuid();
//         var ex = Assert.ThrowsAsync<UnauthorizedAccessException>(
//             async () => await SendAsync(new DispatchStackDeployment.Command(stackId))
//         );
//
//         ex.Message.Should().Be($"User does not have access to stack {stackId}");
//     }
//
//     [Test]
//     public async Task ShouldDispatchStackDeployment()
//     {
//         await RunAsAdministratorAsync();
//         var stack = await CreateSampleStack();
//
//         _mockDispatcher.Setup(d => d.EnqueueStackDeployment(stack.Id))
//             .ReturnsAsync("job-id");
//
//         var result = await SendAsync(new DispatchStackDeployment.Command(stack.Id));
//
//         result.Should().NotBeNull();
//         result.DeploymentId.Should().NotBe(Guid.Empty);
//         _mockDispatcher.Verify(d => d.EnqueueStackDeployment(stack.Id), Times.Once);
//     }
// }
