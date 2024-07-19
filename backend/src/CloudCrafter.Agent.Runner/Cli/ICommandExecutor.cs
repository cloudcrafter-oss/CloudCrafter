namespace CloudCrafter.Agent.Runner.Cli;

public interface ICommandExecutor
{
    Task<ExecutorResult> ExecuteAsync(string command, IEnumerable<string> arguments);
}
