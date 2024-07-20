namespace CloudCrafter.Agent.Runner.Cli.Helpers;

public interface IFileSystemHelper
{
    Task WriteFile(string file, string contents);
    Task EnsureDirectoryExists(string directory);
}
