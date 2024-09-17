using CloudCrafter.Agent.Models.Recipe;

namespace CloudCrafter.Agent.Models.IO;

public class YamlRecipeWriter(DeploymentRecipe recipe)
{
    public string WriteString()
    {
        var serializer = new CustomYamlHandler();
        var yaml = serializer.Serialize(recipe);

        return yaml;
    }

    public void WriteToFile(string filename)
    {
        var yaml = WriteString();
        File.WriteAllText(filename, yaml);
    }
}
