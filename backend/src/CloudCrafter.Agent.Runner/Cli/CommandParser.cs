namespace CloudCrafter.Agent.Runner.Cli;

public class CommandParser : ICommandParser
{
    public string ParseSingleOutput(string output)
    {
        return output.Replace("\n", string.Empty);
    }
}
