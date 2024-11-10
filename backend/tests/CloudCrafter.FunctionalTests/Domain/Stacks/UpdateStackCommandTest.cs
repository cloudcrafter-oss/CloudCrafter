using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks;

using static Testing;

public class UpdateStackCommandTest : BaseTestFixture
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new UpdateStackCommand.Command(Guid.NewGuid()))
        );
    }

    [Test]
    public async Task ShoulThrowErrorWhenNoAccessBecauseItDoesNotExists()
    {
        await RunAsAdministratorAsync();

        var stackId = Guid.NewGuid();
        var ex = Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new UpdateStackCommand.Command(stackId))
        );

        ex.Message.Should().Be($"User does not have access to stack {stackId}");
    }

    [TestCase("Name", "New Test Name")]
    [TestCase("Description", "New Test Description")]
    public async Task ShouldUpdateStackProperty(string propertyName, string newValue)
    {
        await RunAsAdministratorAsync();
        var stack = await CreateSampleStack();

        // Create command dynamically based on property name
        var command = propertyName switch
        {
            "Name" => new UpdateStackCommand.Command(stack.Id, Name: newValue),
            "Description" => new UpdateStackCommand.Command(stack.Id, Description: newValue),
            _ => throw new ArgumentException($"Unsupported property: {propertyName}"),
        };

        await SendAsync(command);

        var updatedStackFromDb = await FindAsync<Stack>(stack.Id);
        updatedStackFromDb.Should().NotBeNull();

        // Verify property value dynamically
        var actualValue = propertyName switch
        {
            "Name" => updatedStackFromDb!.Name,
            "Description" => updatedStackFromDb!.Description,
            _ => throw new ArgumentException($"Unsupported property: {propertyName}"),
        };

        actualValue.Should().Be(newValue);
    }
}
