using CloudCrafter.DockerCompose.Engine.Yaml;
using CloudCrafter.Shared.Utils.Cli;

namespace CloudCrafter.DockerCompose.Engine.Validator;

public class DockerComposeValidator
{
    private readonly DockerComposeEditor? _editor;

    public DockerComposeValidator(string yamlString)
    {
        try
        {
            _editor = new DockerComposeEditor(yamlString);
        }
        catch { }
    }

    public DockerComposeValidator(DockerComposeEditor editor)
    {
        _editor = editor;
    }

    public async Task<Result> IsValid()
    {
        if (_editor == null)
        {
            return new Result() { IsValid = false, ErrorMessage = "Invalid docker compose editor" };
        }
        // Create temporary file
        var tempPath = Path.GetTempPath();
        var tempFile = tempPath + ".yaml";
        try
        {
            var yaml = _editor.GetYaml();
            await File.WriteAllTextAsync(tempFile, yaml);

            // environment files

            var envFiles = _editor.GetEnvironmentVariables();
            foreach (var envFile in envFiles)
            {
                var envFilePath = tempPath + envFile.Key;
                await File.WriteAllTextAsync(envFilePath, envFile.Value.GetFileContents());
            }

            var executor = new CommandExecutor();

            var result = await executor.ExecuteAsync(
                "docker",
                ["compose", "-f", tempFile, "config"]
            );
            // Create process to run docker compose validate

            var isValid = result.ExitCode == 0;

            return new Result { IsValid = isValid, ErrorMessage = result.StdErr };
        }
        catch (Exception ex)
        {
            return new Result { IsValid = false, ErrorMessage = ex.Message };
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

    public class Result
    {
        public required bool IsValid { get; init; }
        public required string? ErrorMessage { get; init; }
    }
}
