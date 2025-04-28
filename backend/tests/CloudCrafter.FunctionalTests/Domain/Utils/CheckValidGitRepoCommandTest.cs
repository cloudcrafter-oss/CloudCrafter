using CloudCrafter.Core.Commands.Utils;
using FluentAssertions;

namespace CloudCrafter.FunctionalTests.Domain.Utils;

using static Testing;

public class CheckValidGitRepoCommandTest : BaseTestFixture
{
    [TestCase("https://github.com/cloudcrafter-oss/CloudCrafter", true)]
    [TestCase("https://gitlab.com/gitlab-org/gitlab", true)]
    [TestCase("https://github.com/cloudcrafter-oss/CloudCrafter", false)]
    [TestCase("https://gitlab.com/gitlab-org/gitlab", false)]
    public async Task ShouldBeAValidGitRepo(string repo, bool isAdmin)
    {
        await RunAsUserRoleAsync(isAdmin);
        var command = new CheckValidGitRepoCommand(repo);

        var result = await SendAsync(command);

        result.Should().NotBeNull();
        result.IsValid.Should().BeTrue();
    }

    [TestCase("https://github.com/cloudcrafter-oss/CloudCrafter-not-existing", true)]
    [TestCase("https://www.google.nl", true)]
    [TestCase("https://github.com/cloudcrafter-oss/CloudCrafter-not-existing", false)]
    [TestCase("https://www.google.nl", false)]
    public async Task ShouldBeInvalidGitRepo(string repo, bool isAdmin)
    {
        await RunAsUserRoleAsync(isAdmin);
        var command = new CheckValidGitRepoCommand(repo);

        var result = await SendAsync(command);

        result.Should().NotBeNull();
        result.IsValid.Should().BeFalse();
    }
}
