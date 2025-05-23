using CloudCrafter.Core.Commands.Stacks;
using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Exceptions;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Domain.Entities;
using CloudCrafter.Infrastructure.Data.Fakeds;
using CloudCrafter.TestUtilities.DomainHelpers;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;

namespace CloudCrafter.FunctionalTests.Domain.Stacks;

using static Testing;

public class UpdateStackCommandTest : BaseTestFixture
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new UpdateStackCommand(Guid.NewGuid()))
        );
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldThrowErrorWhenNoAccessBecauseItDoesNotExists(bool isAdmin)
    {
        await RunAsUserRoleAsync(isAdmin);

        var stackId = Guid.NewGuid();
        var ex = Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () => await SendAsync(new UpdateStackCommand(stackId))
        );

        ex.Message.Should().Be($"User does not have access to stack {stackId}");
    }

    [TestCase("Name", "New Test Name", true)]
    [TestCase("Description", "New Test Description", true)]
    [TestCase("PublicGitRepo", "https://github.com/cloudcrafter-oss/CloudCrafter", true)]
    [TestCase("Name", "New Test Name", false)]
    [TestCase("Description", "New Test Description", false)]
    [TestCase("PublicGitRepo", "https://github.com/cloudcrafter-oss/CloudCrafter", false)]
    public async Task ShouldUpdateStackProperty(string propertyName, string newValue, bool isAdmin)
    {
        var userId = await RunAsUserRoleAsync(isAdmin);

        var stack = await CreateSampleStack(
            stack =>
                stack.Source = new ApplicationSource
                {
                    Git = new ApplicationSourceGit
                    {
                        Repository = "",
                        Branch = "",
                        Path = "",
                    },
                    Type = ApplicationSourceType.Git,
                },
            !isAdmin ? userId : null
        );

        var command = propertyName switch
        {
            "Name" => new UpdateStackCommand(stack.Id, newValue),
            "Description" => new UpdateStackCommand(stack.Id, Description: newValue),
            "PublicGitRepo" => new UpdateStackCommand(
                stack.Id,
                GitPublicSettings: new UpdateStackGitPublicSettings { Repository = newValue }
            ),
            _ => throw new NotImplementedException(),
        };

        await SendAsync(command);

        var context = GetService<IApplicationDbContext>();
        var updatedStackFromDb = await context
            .Stacks.Include(x => x.Source!)
            .ThenInclude(x => x.Git)
            .FirstOrDefaultAsync(x => x.Id == stack.Id);
        updatedStackFromDb.Should().NotBeNull();

        // Verify property value dynamically
        var actualValue = propertyName switch
        {
            "Name" => updatedStackFromDb!.Name,
            "Description" => updatedStackFromDb!.Description,
            "PublicGitRepo" => updatedStackFromDb!.Source!.Git!.Repository,
            _ => throw new ArgumentException($"Unsupported property: {propertyName}"),
        };

        actualValue.Should().Be(newValue);
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToUpdatePublicGitRepoBecauseRepoIsInvalid(bool isAdmin)
    {
        var userId = await RunAsUserRoleAsync(isAdmin);
        var stack = await CreateSampleStack(null, !isAdmin ? userId : null);

        var command = new UpdateStackCommand(
            stack.Id,
            GitPublicSettings: new UpdateStackGitPublicSettings
            {
                Repository = "http://github.com/non/existing",
                Branch = "main",
                Path = "/",
            }
        );

        var exception = Assert.ThrowsAsync<ValidationException>(
            async () => await SendAsync(command)
        );

        exception.Message.Should().Be("One or more validation failures have occurred.");
        exception.Errors.Count.Should().Be(1);
        exception.Errors.ContainsKey("GitRepository").Should().BeTrue();
        exception.Errors["GitRepository"][0].Should().Be("Invalid Git repository");
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotAbleToUpdateGithubAppBranchBecauseBranchDoesNotExists(bool isAdmin)
    {
        var userId = await RunAsUserRoleAsync(isAdmin);

        var environmentId = Guid.Parse("f41d5c09-2fa1-459a-ae09-9eda843135df");
        var deploymentId = Guid.Parse("fde85aa6-8dd6-48c9-8c4b-8172a2f15f28");
        var stackId = Guid.Parse("35223e08-9c9f-4322-972e-51c610c202e3");
        var stackServiceId = Guid.Parse("b34a6560-701d-4f0e-b024-b4b7b2155bcf");

        var team = await CreateTeam(!isAdmin ? userId : null);
        var project = FakerInstances.ProjectFaker(team.Id).Generate();
        await AddAsync(project);

        var environment = FakerInstances
            .EnvironmentFaker(project)
            .RuleFor(x => x.Id, f => environmentId)
            .Generate();
        await AddAsync(environment);

        var stack = EntityFaker.GenerateStackWithGithubApp(environmentId, stackId, stackServiceId);
        await AddAsync(stack);

        var command = new UpdateStackCommand(
            stack.Id,
            GithubSettings: new UpdateStackGithubSettings { Branch = "dummy" }
        );

        var exception = Assert.ThrowsAsync<ValidationException>(
            async () => await SendAsync(command)
        );

        exception.Message.Should().Be("One or more validation failures have occurred.");
        exception.Errors.Count.Should().Be(1);
        exception.Errors.ContainsKey("Branch").Should().BeTrue();
        exception.Errors["Branch"][0].Should().Be("Invalid branch");
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldNotBeAbleToUpdateStackBecauseUserIsNotTeamOwner(bool attachToTeam)
    {
        var userId = await RunAsDefaultUserAsync();
        var team = await CreateTeam();

        var environmentId = Guid.Parse("f41d5c09-2fa1-459a-ae09-9eda843135df");
        var stackId = Guid.Parse("35223e08-9c9f-4322-972e-51c610c202e3");
        var stackServiceId = Guid.Parse("b34a6560-701d-4f0e-b024-b4b7b2155bcf");

        if (attachToTeam)
        {
            await AddToTeam(team, userId);
        }

        var project = FakerInstances.ProjectFaker(team.Id).Generate();
        await AddAsync(project);

        var environment = FakerInstances
            .EnvironmentFaker(project)
            .RuleFor(x => x.Id, f => environmentId)
            .Generate();
        await AddAsync(environment);

        var stack = EntityFaker.GenerateStackWithGithubApp(environmentId, stackId, stackServiceId);
        await AddAsync(stack);

        var command = new UpdateStackCommand(
            stack.Id,
            GithubSettings: new UpdateStackGithubSettings { Branch = "test-branch" }
        );

        Assert.ThrowsAsync<NotEnoughPermissionInTeamException>(
            async () => await SendAsync(command)
        );
    }

    [TestCase(true)]
    [TestCase(false)]
    public async Task ShouldBeAbleToUpdateGithubAppBranch(bool isAdmin)
    {
        var userId = await RunAsUserRoleAsync(isAdmin);
        var environmentId = Guid.Parse("f41d5c09-2fa1-459a-ae09-9eda843135df");
        var deploymentId = Guid.Parse("fde85aa6-8dd6-48c9-8c4b-8172a2f15f28");
        var stackId = Guid.Parse("35223e08-9c9f-4322-972e-51c610c202e3");
        var stackServiceId = Guid.Parse("b34a6560-701d-4f0e-b024-b4b7b2155bcf");

        var team = await CreateTeam(!isAdmin ? userId : null);
        var project = FakerInstances.ProjectFaker(team.Id).Generate();
        await AddAsync(project);

        var environment = FakerInstances
            .EnvironmentFaker(project)
            .RuleFor(x => x.Id, f => environmentId)
            .Generate();
        await AddAsync(environment);

        var stack = EntityFaker.GenerateStackWithGithubApp(environmentId, stackId, stackServiceId);
        await AddAsync(stack);

        var command = new UpdateStackCommand(
            stack.Id,
            GithubSettings: new UpdateStackGithubSettings { Branch = "test-branch" }
        );

        await SendAsync(command);

        var repository = GetService<IStackRepository>();
        var updatedStackFromDb = await repository.GetStack(stack.Id);

        updatedStackFromDb.Should().NotBeNull();
        updatedStackFromDb!.Source!.GithubApp!.Branch.Should().Be("test-branch");
    }
}
