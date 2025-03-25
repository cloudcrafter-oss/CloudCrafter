using Ardalis.GuardClauses;
using CloudCrafter.Core.Commands.Stacks.EnvironmentVariables;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Stacks.EnvironmentVariables;

using static Testing;

public class DeleteStackEnvironmentVariableGroupCommandTest : BaseEnvironmentVariablesTest
{
    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(
            async () =>
                await SendAsync(
                    new DeleteStackEnvironmentVariableGroupCommand(Guid.NewGuid(), Guid.NewGuid())
                )
        );
    }

    [Test]
    public async Task ShouldThrowExceptionWhenStackIdDoesNotExists()
    {
        await RunAsAdministratorAsync();

        await AssertEnvGroupCount(0);
        Assert.ThrowsAsync<NotFoundException>(
            async () =>
                await SendAsync(
                    new DeleteStackEnvironmentVariableGroupCommand(Guid.NewGuid(), Guid.NewGuid())
                )
        );
    }
}
