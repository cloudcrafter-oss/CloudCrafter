using CloudCrafter.Agent.Models.IO;
using FluentAssertions;

namespace CloudCrafter.Agent.Runner.Tests.IO;

public class CustomYamlHandlerTest
{
    private CustomYamlHandler _handler;
    private CustomObject _object;

    [SetUp]
    public void SetUp()
    {
        _handler = new CustomYamlHandler();

        _object = new CustomObject
        {
            String = "Hello, World!",
            Int = 42,
            Bool = true,
            ListString = new List<string> { "apple", "banana", "cherry" },
            ListInt = new List<int> { 1, 2, 3, 4, 5 },
            DictStringBool = new Dictionary<string, bool> { { "key1", true }, { "key2", false } },
            DictStringString = new Dictionary<string, string>
            {
                { "name", "John Doe" },
                { "city", "New York" },
            },
            DictStringObject = new Dictionary<string, object>
            {
                { "number", 10 },
                { "text", "sample" },
                { "flag", false },
            },
            DictStringListString = new Dictionary<string, List<string>>
            {
                {
                    "fruits",
                    new List<string> { "apple", "banana", "cherry" }
                },
                {
                    "colors",
                    new List<string> { "red", "green", "blue" }
                },
            },
            Double = 3.14159,
        };
    }

    [Test]
    public async Task ShouldSerialize()
    {
        var yaml = _handler.Serialize(_object);

        await Verify(yaml);
    }

    [Test]
    public void ShouldBeAbleToDeserializeYaml()
    {
        var yaml = _handler.Serialize(_object);

        var deserializedObject = _handler.Deserialize<CustomObject>(yaml);
        // validate it is same as _object

        deserializedObject.String.Should().Be(_object.String);
        deserializedObject.Int.Should().Be(_object.Int);
        deserializedObject.Bool.Should().Be(_object.Bool);
        deserializedObject.ListString.Should().BeEquivalentTo(_object.ListString);
        deserializedObject.ListInt.Should().BeEquivalentTo(_object.ListInt);
        deserializedObject.DictStringBool.Should().BeEquivalentTo(_object.DictStringBool);
        deserializedObject.DictStringString.Should().BeEquivalentTo(_object.DictStringString);
        deserializedObject.DictStringObject.Should().BeEquivalentTo(_object.DictStringObject);
        deserializedObject
            .DictStringListString.Should()
            .BeEquivalentTo(_object.DictStringListString);
        deserializedObject.Double.Should().BeApproximately(_object.Double, 1e-6);
    }
}

public class CustomObject
{
    public required string String { get; init; }
    public required int Int { get; init; }
    public required bool Bool { get; init; }
    public required List<string> ListString { get; init; }
    public required List<int> ListInt { get; init; }
    public required Dictionary<string, bool> DictStringBool { get; init; }
    public required Dictionary<string, string> DictStringString { get; init; }
    public required Dictionary<string, object> DictStringObject { get; init; }
    public required Dictionary<string, List<string>> DictStringListString { get; init; }
    public required double Double { get; init; }
}
