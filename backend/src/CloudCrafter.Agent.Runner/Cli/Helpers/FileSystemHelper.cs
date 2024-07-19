namespace CloudCrafter.Agent.Runner.Cli.Helpers;

public class FileSystemHelper : IFileSystemHelper
{
    public Task WriteFile(string file, string contents)
    {
        return File.WriteAllTextAsync(file, contents);
    }
}
