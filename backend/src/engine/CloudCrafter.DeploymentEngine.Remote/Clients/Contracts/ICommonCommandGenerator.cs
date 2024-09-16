namespace CloudCrafter.DeploymentEngine.Remote.Clients.Contracts;

public interface ICommonCommandGenerator
{
    string WriteContentsToFile(string contents, string filePath);
}
