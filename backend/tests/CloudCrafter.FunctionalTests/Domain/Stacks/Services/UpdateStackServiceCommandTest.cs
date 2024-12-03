using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Core.Commands.Stacks.Service;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.Services;

using static Testing;

public class UpdateStackServiceCommandTest : BaseTestFixture
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () =>
                await SendAsync(
                    new UpdateStackServiceCommand.Command(Guid.NewGuid(), Guid.NewGuid())
                )
        );
    }

    [Test]
    public async Task ShoulThrowErrorWhenNoAccessBecauseItDoesNotExists()
    {
        await RunAsAdministratorAsync();

        var stackId = Guid.NewGuid();
        var ex = Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new UpdateStackServiceCommand.Command(stackId, stackId))
        );

        ex.Message.Should().Be($"User does not have access to stack {stackId}");
    }

    [TestCase("Name", "New Test Name")]
    public async Task ShouldUpdateStackServiceProperty(string propertyName, string newValue)
    {
        await RunAsAdministratorAsync();
        var stack = await CreateSampleStack();

        var stackService = FakerInstances
            .StackServiceFaker(stack)
            .RuleFor(x => x.Stack, (Stack?)null)
            .Generate();
        await AddAsync(stackService);

        // Create command dynamically based on property name
        var command = propertyName switch
        {
            "Name" => new UpdateStackServiceCommand.Command(
                stack.Id,
                stackService.Id,
                Name: newValue
            ),
            _ => throw new ArgumentException($"Unsupported property: {propertyName}"),
        };

        await SendAsync(command);

        var updatedStackServiceFromDb = await FindAsync<StackService>(stackService.Id);
        updatedStackServiceFromDb.Should().NotBeNull();

        // Verify property value dynamically
        var actualValue = propertyName switch
        {
            "Name" => updatedStackServiceFromDb!.Name,
            _ => throw new ArgumentException($"Unsupported property: {propertyName}"),
        };

        actualValue.Should().Be(newValue);
    }
}
