using CloudCrafter.Core.Commands.Stacks;

namespace CloudCrafter.FunctionalTests.Domain.Stacks;

using static Testing;

public class DispatchImportStackServicesFromGitRepositoryCommandTest : BaseStackTest
{
    private readonly DispatchImportStackServicesFromGitRepositoryCommand Command =
        new() { StackId = Guid.NewGuid() };

    [Test]
    public void ShouldThrowExceptionWhenUserIsNotLoggedIn()
    {
        Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await SendAsync(Command));
    }
}
