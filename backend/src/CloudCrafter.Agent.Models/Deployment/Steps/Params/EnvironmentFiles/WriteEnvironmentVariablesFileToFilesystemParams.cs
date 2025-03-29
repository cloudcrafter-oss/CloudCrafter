namespace CloudCrafter.Agent.Models.Deployment.Steps.Params.EnvironmentFiles;

public class WriteEnvironmentVariablesFileToFilesystemParams : BaseParams
{
    public string FileName { get; init; } = string.Empty;
    public string FileContents { get; init; } = string.Empty;
}
