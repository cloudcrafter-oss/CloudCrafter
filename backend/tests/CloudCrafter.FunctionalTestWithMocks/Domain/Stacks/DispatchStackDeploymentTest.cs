using System.Data.Common;
using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Jobs.Dispatcher;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Moq;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTestWithMocks.Domain.Stacks;

public class DispatchStackDeploymentTest : BaseReplaceTest
{
    private Mock<ICloudCrafterDispatcher> _mockDispatcher = new();

    public override Task<CustomWebApplicationFactory> CustomSetup(
        DbConnection postgreSqlConnection,
        string redisConnectionString
    )
    {
        _mockDispatcher = new Mock<ICloudCrafterDispatcher>();
        var factory = new CustomWebApplicationFactory(
            postgreSqlConnection,
            redisConnectionString,
            services =>
            {
                services.RemoveAll<ICloudCrafterDispatcher>();

                services
                    .RemoveAll<IUser>()
                    .AddTransient(provider => Mock.Of<IUser>(s => s.Id == _userId));
                services.AddScoped<ICloudCrafterDispatcher>(_ => _mockDispatcher.Object);
            }
        );

        return Task.FromResult(factory);
    }

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new DispatchStackDeployment.Command(Guid.NewGuid()))
        );
    }

    [Test]
    public async Task ShoulThrowErrorWhenNoAccessBecauseItDoesNotExists()
    {
        await RunAsAdministratorAsync();

        var stackId = Guid.NewGuid();
        var ex = Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new DispatchStackDeployment.Command(stackId))
        );

        ex.Message.Should().Be($"User does not have access to stack {stackId}");
    }

    [Test]
    public async Task ShouldDispatchStackDeployment()
    {
        await RunAsAdministratorAsync();
        var stack = await CreateSampleStack();

        _mockDispatcher
            .Setup(d => d.EnqueueStackDeployment(It.IsAny<Guid>()))
            .ReturnsAsync("job-id");

        var result = await SendAsync(new DispatchStackDeployment.Command(stack.Id));

        result.Should().NotBeNull();
        result.DeploymentId.Should().NotBe(Guid.Empty);
        _mockDispatcher.Verify(d => d.EnqueueStackDeployment(result.DeploymentId), Times.Once);
    }
}
