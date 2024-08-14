using CloudCrafter.Agent.Models.Recipe;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

namespace CloudCrafter.Agent.Runner.IO;

public class YamlRecipeWriter(DeploymentRecipe recipe)
{
    public string WriteString()
    {
        var serializer = new SerializerBuilder()
            .WithNamingConvention(CamelCaseNamingConvention.Instance)
            .ConfigureDefaultValuesHandling(DefaultValuesHandling.OmitNull)
            .Build();

        var yaml = serializer.Serialize(recipe);

        return yaml;
    }

    public void WriteToFile(string filename)
    {
        var yaml = WriteString();
        File.WriteAllText(filename, yaml);
    }
}
