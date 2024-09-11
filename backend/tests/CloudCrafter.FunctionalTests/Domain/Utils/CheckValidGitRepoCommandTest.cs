using CloudCrafter.Core.Commands.Utils;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Domain.Utils;

using static Testing;

public class CheckValidGitRepoCommandTest : BaseTestFixture
{
    [TestCase("https://github.com/cloudcrafter-oss/CloudCrafter")]
    [TestCase("https://gitlab.com/gitlab-org/gitlab")]
    public async Task ShouldBeAValidGitRepo(string repo)
    {
        var command = new CheckValidGitRepoCommand.Command(repo);

        var result = await SendAsync(command);

        result.Should().NotBeNull();
        result.IsValid.Should().BeTrue();
    }

    [TestCase("https://github.com/cloudcrafter-oss/CloudCrafter-not-existing")]
    [TestCase("https://www.google.nl")]
    public async Task ShouldBeInvalidGitRepo(string repo)
    {
        var command = new CheckValidGitRepoCommand.Command(repo);

        var result = await SendAsync(command);

        result.Should().NotBeNull();
        result.IsValid.Should().BeFalse();
    }
}
