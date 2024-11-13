using CloudCrafter.Core.Interfaces.Domain.Utils;
using FluentAssertions;
using NUnit.Framework;

namespace CloudCrafter.FunctionalTests.Services.Domain.Utils;

using static Testing;

public class GitServiceTest : BaseTestFixture
{
    [TestCase("https://github.com/cloudcrafter-oss/demo-examples", null, null)]
    [TestCase("https://github.com/cloudcrafter-oss/demo-examples", "/", null)]
    [TestCase("https://github.com/cloudcrafter-oss/demo-examples", "/nixpacks-node-server", null)]
    [TestCase("https://github.com/cloudcrafter-oss/demo-examples", null, "main")]
    [TestCase("https://github.com/cloudcrafter-oss/demo-examples", "/", "main")]
    [TestCase("https://github.com/cloudcrafter-oss/demo-examples", "/nixpacks-node-server", "main")]
    public async Task ShouldBeValidRepo(string repo, string? path, string? branch)
    {
        var service = GetService<IGitService>();

        var result = await service.ValidateRepository(repo, path, branch);

        result.IsValid.Should().BeTrue();
    }

    [TestCase("https://github.com/cloudcrafter-oss/demo-exampless", null, null)]
    [TestCase("https://github.com/cloudcrafter-oss/demo-examples", "/non-existing", null)]
    [TestCase("https://github.com/cloudcrafter-oss/demo-examples", null, "non-existing-branch")]
    [TestCase("https://github.com/cloudcrafter-oss/demo-examples", "/", "non-existing-branch")]
    [TestCase(
        "https://github.com/cloudcrafter-oss/demo-examples",
        "/non-existing",
        "non-existing-branch"
    )]
    public async Task ShouldBeInvalidRepo(string repo, string? path, string? branch)
    {
        var service = GetService<IGitService>();

        var result = await service.ValidateRepository(repo, path, branch);

        result.IsValid.Should().BeFalse();
    }
}
