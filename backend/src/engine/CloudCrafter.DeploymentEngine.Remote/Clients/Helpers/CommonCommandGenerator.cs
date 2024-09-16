using System.Text;
using CloudCrafter.DeploymentEngine.Remote.Clients.Contracts;

namespace CloudCrafter.DeploymentEngine.Remote.Clients.Helpers;

public class CommonCommandGenerator : ICommonCommandGenerator
{
    public string WriteContentsToFile(string contents, string filePath)
    {
        string base64Contents = Convert.ToBase64String(Encoding.UTF8.GetBytes(contents));
        return $"echo '{base64Contents}' | base64 -d > {filePath}";
    }
}
