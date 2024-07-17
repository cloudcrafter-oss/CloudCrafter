namespace CloudCrafter.Agent.Runner.Cli;

public interface ICommandExecutor
{
    Task ExecuteAsync(string command, string arguments);
}
