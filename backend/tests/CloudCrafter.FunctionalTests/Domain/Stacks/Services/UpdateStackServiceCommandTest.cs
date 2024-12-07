using CloudCrafter.Core.Commands.Stacks.Service;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data;
using CloudCrafter.Infrastructure.Data.Fakeds;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
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
    [TestCase("DomainName", "https://my-domain.com")]
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
            "Name" => new UpdateStackServiceCommand.Command(stack.Id, stackService.Id, newValue),
            "DomainName" => new UpdateStackServiceCommand.Command(
                stack.Id,
                stackService.Id,
                DomainName: newValue
            ),
            _ => throw new ArgumentException($"Unsupported property: {propertyName}"),
        };

        await SendAsync(command);

        var dbContext = GetService<AppDbContext>();

        var updatedStackServiceFromDb = await dbContext
            .StackServices.Include(x => x.HttpConfiguration)
            .FirstOrDefaultAsync(x => x.Id == stackService.Id);
        updatedStackServiceFromDb.Should().NotBeNull();

        // Verify property value dynamically
        var actualValue = propertyName switch
        {
            "Name" => updatedStackServiceFromDb!.Name,
            "DomainName" => updatedStackServiceFromDb!.HttpConfiguration?.DomainName,
            _ => throw new ArgumentException($"Unsupported property: {propertyName}"),
        };

        actualValue.Should().Be(newValue);
    }

    [TestCase(
        "Name",
        "a",
        "The length of 'Name' must be at least 2 characters. You entered 1 characters."
    )]
    [TestCase(
        "DomainName",
        "a",
        "The length of 'Domain Name' must be at least 2 characters. You entered 1 characters."
    )]
    public async Task ShouldThrowValidationError(
        string propertyName,
        string newValue,
        string errorMessage
    )
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
            "Name" => new UpdateStackServiceCommand.Command(stack.Id, stackService.Id, newValue),
            "DomainName" => new UpdateStackServiceCommand.Command(
                stack.Id,
                stackService.Id,
                DomainName: newValue
            ),
            _ => throw new ArgumentException($"Unsupported property: {propertyName}"),
        };

        var ex = Assert.ThrowsAsync<ValidationException>(async () => await SendAsync(command));

        ex.Errors.Count.Should().Be(1);
        ex.Errors[propertyName].Length.Should().Be(1);
        ex.Errors[propertyName][0].Should().Be(errorMessage);
    }
}
