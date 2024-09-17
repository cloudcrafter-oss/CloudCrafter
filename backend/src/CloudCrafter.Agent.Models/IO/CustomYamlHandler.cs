using YamlDotNet.Core;
using YamlDotNet.Core.Events;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace CloudCrafter.Agent.Models.IO;

public class CustomYamlHandler
{
    private readonly IDeserializer _deserializer = new DeserializerBuilder()
        .WithNamingConvention(CamelCaseNamingConvention.Instance)
        .WithTypeConverter(new CustomObjectConverter())
        .Build();

    private readonly ISerializer _serializer = new SerializerBuilder()
        .WithNamingConvention(CamelCaseNamingConvention.Instance)
        .ConfigureDefaultValuesHandling(DefaultValuesHandling.OmitNull)
        .Build();

    public T Deserialize<T>(string input)
    {
        return _deserializer.Deserialize<T>(input);
    }

    public string Serialize(object input)
    {
        return _serializer.Serialize(input);
    }
}

public class CustomObjectConverter : IYamlTypeConverter
{
    public bool Accepts(Type type)
    {
        return type == typeof(object);
    }

    public object? ReadYaml(IParser parser, Type type)
    {
        var scalar = parser.Consume<Scalar>();
        var value = scalar.Value;

        // Try parsing as boolean
        if (bool.TryParse(value, out var boolResult))
        {
            return boolResult;
        }

        // Try parsing as integer
        if (int.TryParse(value, out var intResult))
        {
            return intResult;
        }

        // Try parsing as double
        if (double.TryParse(value, out var doubleResult))
        {
            return doubleResult;
        }

        // If it is an object and an empty string (scalar maps "nullish" values to empty strings)
        // example:
        // httpPort: (WHITESPACE)
        // the value of (WHITESPACE) will be an empty string.
        if (type == typeof(object) && string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return value;
    }

    public void WriteYaml(IEmitter emitter, object? value, Type type)
    {
        throw new NotImplementedException();
    }
}
