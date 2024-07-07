using CloudCrafter.DockerCompose.Engine.Validator;
using CloudCrafter.DockerCompose.Engine.Yaml;
using FluentAssertions;

namespace CloudCrafter.DockerCompose.Engine.UnitTests;

public class DockerComposeValidatorTests
{
    public static IEnumerable<TestCaseData> GetTestStringsFromFiles()
    {
        string testDataDirectory = Path.Combine(TestContext.CurrentContext.TestDirectory, "TestData", "ValidFiles");
    
        foreach (string file in Directory.GetFiles(testDataDirectory, "*.txt"))
        {
            string content = File.ReadAllText(file);
            yield return new TestCaseData(content).SetName($"Test_{Path.GetFileNameWithoutExtension(file)}");
        }
    }
    
    [Test]
    [TestCaseSource(nameof(GetTestStringsFromFiles))]
    public async Task TestMethod(string input)
    {
        var validator = new DockerComposeValidator(input);

        var isValid = await validator.IsValid();

        isValid.Should().BeTrue();
    }
}
