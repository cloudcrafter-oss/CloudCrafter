namespace CloudCrafter.Shared.Utils.Cli.Abstraction;

public interface ICommandExecutor
{
    Task<ExecutorResult> ExecuteAsync(string command, IEnumerable<string> arguments);

    Task<ExecutorResult> ExecuteWithStreamAsync(string command, IEnumerable<string> arguments,
        Action<ExecutorStreamResult>? onLog = null);
}
