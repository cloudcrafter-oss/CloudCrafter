using System.Diagnostics;
using CloudCrafter.Shared.Utils.Cli;

namespace CloudCrafter.DockerCompose.Engine.Validator;

public class DockerComposeValidator(string YamlContent)
{
    public async Task<bool> IsValid()
    {
        // Create temporary file
        var tempFile = Path.GetTempFileName() + ".yaml";
        try
        {
            await File.WriteAllTextAsync(tempFile, YamlContent);

            var executor = new CommandExecutor();

            var result = await executor.ExecuteAsync(
                "docker",
                ["compose", "-f", tempFile, "config"]
            );
            // Create process to run docker compose validate

            return result.ExitCode == 0;
        }
        catch
        {
            return false;
        }
        finally
        {
            // Cleanup temporary file
            if (File.Exists(tempFile))
            {
                File.Delete(tempFile);
            }
        }
    }
}
