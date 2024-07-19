using System.ComponentModel;
using System.Text;
using CliWrap;

namespace CloudCrafter.Agent.Runner.Cli;

public class CommandExecutor : ICommandExecutor
{
    public async Task<ExecutorResult> ExecuteAsync(string command, IEnumerable<string> arguments)
    {
        var stdOutBuffer = new StringBuilder();
        var stdErrBuffer = new StringBuilder();
        
        try
        {
            var result = await CliWrap.Cli.Wrap(command)
                .WithArguments(arguments)
                .WithValidation(CommandResultValidation.None)
                .WithStandardOutputPipe(PipeTarget.ToStringBuilder(stdOutBuffer))
                .WithStandardErrorPipe(PipeTarget.ToStringBuilder(stdErrBuffer))
                .ExecuteAsync();

            return new ExecutorResult
            {
                StdOut = stdOutBuffer.ToString(),
                StdErr = stdErrBuffer.ToString(),
                ExitCode = result.ExitCode,
                IsSuccess = result.ExitCode == 0
            };
        }
        catch (Win32Exception ex) when (ex.NativeErrorCode == 2)
        {
            return new ExecutorResult
            {
                StdErr = $"Command not found: {command}",
                ExitCode = -1,
                IsSuccess = false
            };
        }
        catch (Exception ex)
        {
            return new ExecutorResult
            {
                StdErr = $"An error occurred: {ex.Message}",
                ExitCode = -1,
                IsSuccess = false
            };
        }
    }
}

public class ExecutorResult
{
    public string? StdOut { get; set; }
    public string? StdErr { get; set; }
    public int ExitCode { get; set; }
    public bool IsSuccess { get; set; }
}
