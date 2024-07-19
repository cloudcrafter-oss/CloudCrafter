namespace CloudCrafter.Agent.Runner.Cli;

public class CommandParser : ICommandParser
{
    public string ParseSingleOutput(string output)
    {
        if (output.EndsWith("\n"))
        {
            output = output.Substring(0, output.Length - 1);
        }

        return output;
    }
}
