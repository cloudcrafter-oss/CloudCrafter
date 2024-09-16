using System.Text;
using CloudCrafter.Agent.Models.IO;
using CloudCrafter.Agent.Models.Recipe;
using YamlDotNet.Core;

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
            var reader = new CustomYamlHandler();

            var recipe = reader.Deserialize<DeploymentRecipe>(yaml);

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
            throw new InvalidOperationException(
                "An unexpected error occurred while deserializing YAML: " + ex.Message,
                ex
            );
        }
    }
}
