using System.Diagnostics;
using CloudCrafter.Shared.Utils.Cli;

namespace CloudCrafter.DockerCompose.Engine.Validator;

public class DockerComposeValidator(string YamlContent)
{
    public class Result
    {
        public required bool IsValid { get; init; }
        public required string? ErrorMessage { get; init; }
    }

    public async Task<Result> IsValid()
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

            var isValid = result.ExitCode == 0;

            return new() { IsValid = isValid, ErrorMessage = result.StdErr };
        }
        catch (Exception ex)
        {
            return new() { IsValid = false, ErrorMessage = ex.Message };
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
