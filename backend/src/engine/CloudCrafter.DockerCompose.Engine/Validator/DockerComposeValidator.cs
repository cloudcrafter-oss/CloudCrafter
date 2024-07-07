using System.Text.Json;
using CloudCrafter.DockerCompose.Engine.Yaml;
using Newtonsoft.Json.Linq;
using NJsonSchema;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace CloudCrafter.DockerCompose.Engine.Validator;

public class DockerComposeValidator(string JsonOrYaml)
{
    private static JsonSchema? DockerComposeSchema { get; set; } = null;

    public async Task<bool> IsValid()
    {
        if (DockerComposeSchema == null)
        {
            DockerComposeSchema = await NJsonSchema.JsonSchema.FromJsonAsync(GetSchema());
        }

        var isJson = IsJson(JsonOrYaml);

        var jsonToParse = JsonOrYaml;
        if (!isJson)
        {
            var isYaml = IsYaml(JsonOrYaml);

            if (!isYaml)
            {
                return false;
            }
            
            jsonToParse = YamlFactory.YamlToJson(JsonOrYaml);
        }

        try
        {
            var result = DockerComposeSchema.Validate(jsonToParse);

            return !result.Any();
        }
        catch
        {
            return false;
        }
    }
    
    public static bool IsJson(string input)
    {
        input = input.Trim();
        if ((input.StartsWith("{") && input.EndsWith("}")) || // For object
            (input.StartsWith("[") && input.EndsWith("]"))) // For array
        {
            try
            {
                var obj = JsonDocument.Parse(input);
                return true;
            }
            catch (Exception) { }
        }
        return false;
    }
    
    public static bool IsYaml(string input)
    {
        try
        {
            var deserializer = new DeserializerBuilder()
                .WithNamingConvention(CamelCaseNamingConvention.Instance)
                .Build();
            var obj = deserializer.Deserialize<object>(input);
            return true;
        }
        catch (Exception) { }
        return false;
    }


    private string GetSchema()
    {
        // get file contentss of docker-compose-schema.json
        var data = File.ReadLines("docker-compose-schema.json");

        return string.Join(Environment.NewLine, data);
    }
}
