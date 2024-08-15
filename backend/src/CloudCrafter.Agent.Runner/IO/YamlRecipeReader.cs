using System.Text;
using CloudCrafter.Agent.Models.Recipe;
using YamlDotNet.Core;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;
using YamlDotNet.Core.Events;


namespace CloudCrafter.Agent.Runner.IO;

public class YamlRecipeReader
{
    public DeploymentRecipe FromBase64(string base64)
    {
        var yaml = Encoding.UTF8.GetString(Convert.FromBase64String(base64));

        return FromString(yaml);
    }

    public DeploymentRecipe? FromFile(string filename)
    {
        var yaml = File.ReadAllText(filename);

        return FromString(yaml);
    }

    public DeploymentRecipe FromString(string yaml)
    {
        try
        {
            var deserializer = new DeserializerBuilder()
                .WithNamingConvention(CamelCaseNamingConvention.Instance)
                .WithTypeConverter(new CustomObjectConverter())
                .Build();

            var recipe = deserializer.Deserialize<DeploymentRecipe>(yaml);


            if (recipe == null)
            {
                throw new InvalidOperationException("Deserialization resulted in a null object.");
            }


            return recipe;
        }
        catch (YamlException ex)
        {
            throw new InvalidOperationException("Failed to deserialize YAML: " + ex.Message, ex);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("An unexpected error occurred while deserializing YAML: " + ex.Message,
                ex);
        }
    }
}


public class CustomObjectConverter : IYamlTypeConverter
{
    public bool Accepts(Type type) => type == typeof(object);

    public object ReadYaml(IParser parser, Type type)
    {
        var scalar = parser.Consume<Scalar>();
        var value = scalar.Value;

        // Try parsing as boolean
        if (bool.TryParse(value, out bool boolResult))
            return boolResult;

        // Try parsing as integer
        if (int.TryParse(value, out int intResult))
            return intResult;

        // Try parsing as double
        if (double.TryParse(value, out double doubleResult))
            return doubleResult;

        // If all else fails, return as string
        return value;
    }

    public void WriteYaml(IEmitter emitter, object? value, Type type)
    {
        throw new NotImplementedException();
    }
}
