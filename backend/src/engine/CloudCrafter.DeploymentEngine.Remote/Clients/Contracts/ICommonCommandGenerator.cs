namespace CloudCrafter.DeploymentEngine.Remote.Clients.Contracts;

public interface ICommonCommandGenerator
{
    string WriteContentsToFile(string contents, string filePath);
    string PullDockerImage(string image);
    string VerifyDockerImageExists(string image);
    string CreateHelperContainer(Guid deploymentId, string image);
    string StopAndRemoveContainer(string containerId);
    string GenerateRandomFile();
    string RunRecipe(string recipeFileDetails);
    string RunInDockerContainer(string containerId, string command);
}
