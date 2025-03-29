using CloudCrafter.DockerCompose.Engine.Models;
using FluentAssertions;

namespace CloudCrafter.DockerCompose.Engine.UnitTests.Models;

[TestFixture]
public class EnvironmentVariableTests
{
    [SetUp]
    public void Setup()
    {
        // Ensure any existing test file is cleaned up
        if (File.Exists(TestEnvFile))
        {
            File.Delete(TestEnvFile);
        }
    }

    [TearDown]
    public void Teardown()
    {
        // Clean up test file after each test
        if (File.Exists(TestEnvFile))
        {
            File.Delete(TestEnvFile);
        }
    }

    private const string TestEnvFile = "test.env";

    [Test]
    public void EnvFileRepresentation_SimpleValue_ShouldProduceCorrectLine()
    {
        // Arrange
        var variable = new EnvironmentVariable { Key = "SIMPLE_KEY", Value = "simplevalue" };

        // Act & Assert
        variable.EnvFileRepresentation().Should().Be("SIMPLE_KEY=simplevalue");
    }

    [Test]
    public void EnvFileRepresentation_ValueWithSpaces_ShouldQuote()
    {
        // Arrange
        var variable = new EnvironmentVariable { Key = "SPACED_KEY", Value = "value with spaces" };

        // Act & Assert
        variable.EnvFileRepresentation().Should().Be("SPACED_KEY='value with spaces'");
    }

    [Test]
    public void EnvFileRepresentation_MultilineValue_ShouldQuote()
    {
        // Arrange
        var multilineValue =
            @"This is a
multiline value
with several lines";
        var variable = new EnvironmentVariable { Key = "MULTILINE_KEY", Value = multilineValue };

        // Act & Assert
        variable
            .EnvFileRepresentation()
            .Should()
            .Be($"MULTILINE_KEY='{multilineValue.Replace("'", "\\'")}'");
    }

    [Test]
    public void EnvironmentVariableCollection_WriteAndReadFile_ShouldPreserveValues()
    {
        // Arrange
        var collection = new EnvironmentVariableCollection
        {
            Variables = new List<EnvironmentVariable>
            {
                new() { Key = "DB_HOST", Value = "localhost" },
                new() { Key = "DB_PORT", Value = "5432" },
                new() { Key = "DB_USER", Value = "test user" },
                new()
                {
                    Key = "MULTILINE_CONFIG",
                    Value =
                        @"This is a
multiline configuration
with special chars: #!@$%",
                },
            },
        };

        // Act
        collection.WriteToFile(TestEnvFile);
        var readCollection = EnvironmentVariableCollection.ReadFromFile(TestEnvFile);

        // Assert
        readCollection.Variables.Should().HaveCount(4);
        readCollection.Variables.First(v => v.Key == "DB_HOST").Value.Should().Be("localhost");
        readCollection.Variables.First(v => v.Key == "DB_PORT").Value.Should().Be("5432");
        readCollection.Variables.First(v => v.Key == "DB_USER").Value.Should().Be("test user");

        var multilineVar = readCollection.Variables.First(v => v.Key == "MULTILINE_CONFIG");
        multilineVar
            .Value.Should()
            .Be(
                @"This is a
multiline configuration
with special chars: #!@$%"
            );
    }

    [Test]
    public void EnvironmentVariable_Parse_SimpleValue_ShouldWork()
    {
        // Arrange
        var line = "SIMPLE_KEY=simple_value";

        // Act
        var variable = EnvironmentVariable.Parse(line);

        // Assert
        variable.Should().NotBeNull();
        variable!.Key.Should().Be("SIMPLE_KEY");
        variable.Value.Should().Be("simple_value");
    }

    [Test]
    public void EnvironmentVariable_Parse_QuotedValue_ShouldRemoveQuotes()
    {
        // Arrange
        var line = "QUOTED_KEY='value with spaces'";

        // Act
        var variable = EnvironmentVariable.Parse(line);

        // Assert
        variable.Should().NotBeNull();
        variable!.Key.Should().Be("QUOTED_KEY");
        variable.Value.Should().Be("value with spaces");
    }

    [Test]
    public void EnvironmentVariable_Parse_CommentLine_ShouldReturnNull()
    {
        // Arrange
        var line = "# This is a comment";

        // Act
        var variable = EnvironmentVariable.Parse(line);

        // Assert
        variable.Should().BeNull();
    }

    [Test]
    public void EnvironmentVariableCollection_FileNotFound_ShouldThrowFileNotFoundException()
    {
        // Arrange
        var nonExistentFile = "non_existent.env";

        // Act & Assert
        FluentActions
            .Invoking(() => EnvironmentVariableCollection.ReadFromFile(nonExistentFile))
            .Should()
            .Throw<FileNotFoundException>()
            .WithMessage($"*{nonExistentFile}*");
    }

    [Test]
    public Task GetFileContents_ShouldProduceCorrectFileFormat()
    {
        // Arrange
        var collection = new EnvironmentVariableCollection
        {
            Variables = new List<EnvironmentVariable>
            {
                new() { Key = "SIMPLE_KEY", Value = "simplevalue" },
                new() { Key = "SPACED_KEY", Value = "value with spaces" },
                new()
                {
                    Key = "MULTILINE_CONFIG",
                    Value =
                        @"This is a
multiline configuration
with special chars: #!@$%",
                },
            },
        };

        // Act
        var fileContents = collection.GetFileContents();

        return Verify(fileContents);
    }

    [Test]
    public Task GetFileContents_ShouldProduceCorrectFileFormat_WithGrouping()
    {
        var groupDatabases = new EnvironmentVariableGroup(
            "Databases",
            "This is a group for databases"
        );
        var authServices = new EnvironmentVariableGroup(
            "Auth Services",
            "This is a group for auth services"
        );
        // Arrange
        var collection = new EnvironmentVariableCollection
        {
            Variables = new List<EnvironmentVariable>
            {
                new()
                {
                    Key = "DB_HOST",
                    Value = "localhost",
                    Group = groupDatabases,
                },
                new()
                {
                    Key = "DB_USER",
                    Value = "test user",
                    Group = groupDatabases,
                },
                new()
                {
                    Key = "DB_SSL",
                    Value = "true",
                    Group = groupDatabases,
                },
                new() { Key = "DUMMY", Value = "dummy" },
                new()
                {
                    Key = "AUTH_DEBUG",
                    Value = "true",
                    Group = authServices,
                },
            },
        };

        // Act
        var fileContents = collection.GetFileContents();

        return Verify(fileContents);
    }
}
