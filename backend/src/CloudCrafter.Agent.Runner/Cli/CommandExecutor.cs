namespace CloudCrafter.Agent.Runner.Cli;

public class CommandExecutor : ICommandExecutor
{
    public Task ExecuteAsync(string command, string arguments)
    {
        return CliWrap.Cli.Wrap(command)
            .WithArguments(arguments)
            .ExecuteAsync();
    }
}
