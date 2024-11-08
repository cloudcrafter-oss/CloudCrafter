using CloudCrafter.DockerCompose.Engine.Validator;
using CloudCrafter.DockerCompose.Engine.Yaml;
using FluentAssertions;

namespace CloudCrafter.DockerCompose.Engine.UnitTests;

public class DockerComposeValidatorTests
{
    public static IEnumerable<TestCaseData> GetValidTestFiles()
    {
        string testDataDirectory = Path.Combine(
            TestContext.CurrentContext.TestDirectory,
            "TestData",
            "ValidFiles"
        );

        foreach (string file in Directory.GetFiles(testDataDirectory, "*.txt"))
        {
            string content = File.ReadAllText(file);
            yield return new TestCaseData(content).SetName(
                $"Test_{Path.GetFileNameWithoutExtension(file)}"
            );
        }
    }

    public static IEnumerable<TestCaseData> GetInvalidTestFiles()
    {
        string testDataDirectory = Path.Combine(
            TestContext.CurrentContext.TestDirectory,
            "TestData",
            "InvalidFiles"
        );

        foreach (string file in Directory.GetFiles(testDataDirectory, "*.txt"))
        {
            string content = File.ReadAllText(file);
            yield return new TestCaseData(content).SetName(
                $"Test_{Path.GetFileNameWithoutExtension(file)}"
            );
        }
    }

    [Test]
    [TestCaseSource(nameof(GetValidTestFiles))]
    public async Task ShouldBeValidDockerComposeFiles(string input)
    {
        var validator = new DockerComposeValidator(input);

        var isValid = await validator.IsValid();

        isValid.IsValid.Should().BeTrue();
    }

    [Test]
    [TestCaseSource(nameof(GetInvalidTestFiles))]
    public async Task ShouldBeInalidDockerComposeFiles(string input)
    {
        var validator = new DockerComposeValidator(input);

        var isValid = await validator.IsValid();

        isValid.IsValid.Should().BeFalse();
    }
}
