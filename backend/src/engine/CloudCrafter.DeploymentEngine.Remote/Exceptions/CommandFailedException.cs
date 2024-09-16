namespace CloudCrafter.DeploymentEngine.Remote.Exceptions;

public class CommandFailedException(string command, string errorResult, string output, int exitCode)
    : Exception(
        $"Command '{command}' failed with exit code {exitCode}. Catch the exception to log more results."
    )
{
    public string Command => command;
    public string ErrorMessage => errorResult;
    public int ExitCode => exitCode;
    public string Output => output;
}
