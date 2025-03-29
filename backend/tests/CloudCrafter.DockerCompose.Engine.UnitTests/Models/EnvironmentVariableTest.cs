namespace CloudCrafter.DockerCompose.Engine.UnitTests.Models;

using System;
using System.IO;
using System.Linq;
using CloudCrafter.DockerCompose.Engine.Models;
using FluentAssertions;
using NUnit.Framework;

[TestFixture]
public class EnvironmentVariableTests
{
    private const string TestEnvFile = "test.env";

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
        string multilineValue =
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
                new EnvironmentVariable { Key = "DB_HOST", Value = "localhost" },
                new EnvironmentVariable { Key = "DB_PORT", Value = "5432" },
                new EnvironmentVariable { Key = "DB_USER", Value = "test user" },
                new EnvironmentVariable
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
        string line = "SIMPLE_KEY=simple_value";

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
        string line = "QUOTED_KEY='value with spaces'";

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
        string line = "# This is a comment";

        // Act
        var variable = EnvironmentVariable.Parse(line);

        // Assert
        variable.Should().BeNull();
    }

    [Test]
    public void EnvironmentVariableCollection_FileNotFound_ShouldThrowFileNotFoundException()
    {
        // Arrange
        string nonExistentFile = "non_existent.env";

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
                new EnvironmentVariable { Key = "SIMPLE_KEY", Value = "simplevalue" },
                new EnvironmentVariable { Key = "SPACED_KEY", Value = "value with spaces" },
                new EnvironmentVariable
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
}
