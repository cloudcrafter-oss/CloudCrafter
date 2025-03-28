using System.Text;

namespace CloudCrafter.DockerCompose.Engine.Models;

public class EnvironmentVariableCollection
{
    public EnvironmentVariableCollection()
    {
        Variables = new List<EnvironmentVariable>();
    }

    public EnvironmentVariableCollection(List<EnvironmentVariable> variables)
    {
        Variables = variables;
    }

    public List<EnvironmentVariable> Variables { get; set; }

    public string GetFileContents()
    {
        var sb = new StringBuilder();

        foreach (var variable in Variables)
        {
            sb.AppendLine($"{variable.Key}={variable.Value}");
        }

        return sb.ToString();
    }
}
