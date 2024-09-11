using System.ComponentModel;
using System.Text;
using CliWrap;
using CliWrap.EventStream;
using CloudCrafter.Shared.Utils.Cli.Abstraction;
using CloudCrafter.Shared.Utils.Cli.Exceptions;

namespace CloudCrafter.Shared.Utils.Cli;

public class CommandExecutor : ICommandExecutor
{
    public async Task<ExecutorResult> ExecuteAsync(string command, IEnumerable<string> arguments)
    {
        var stdOutBuffer = new StringBuilder();
        var stdErrBuffer = new StringBuilder();

        try
        {
            var result = await CliWrap
                .Cli.Wrap(command)
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
                IsSuccess = result.ExitCode == 0,
            };
        }
        catch (Win32Exception ex) when (ex.NativeErrorCode == 2)
        {
            return new ExecutorResult
            {
                StdErr = $"Command not found: {command}",
                ExitCode = -1,
                IsSuccess = false,
            };
        }
        catch (Exception ex)
        {
            return new ExecutorResult
            {
                StdErr = $"An error occurred: {ex.Message}",
                ExitCode = -1,
                IsSuccess = false,
            };
        }
    }

    public async Task<ExecutorResult> ExecuteWithStreamAsync(
        string command,
        IEnumerable<string> arguments,
        Action<ExecutorStreamResult>? onLog = null
    )
    {
        try
        {
            var cmd = CliWrap.Cli.Wrap(command).WithArguments(arguments);
            var stdOutBuffer = new StringBuilder();
            var stdErrBuffer = new StringBuilder();

            int? exitCode = null;
            await foreach (var cmdEvent in cmd.ListenAsync())
            {
                switch (cmdEvent)
                {
                    case StandardOutputCommandEvent stdOut:
                        onLog?.Invoke(new ExecutorStreamResult(false, stdOut.Text));
                        stdOutBuffer.AppendLine(stdOut.Text);
                        break;
                    case StandardErrorCommandEvent stdErr:
                        onLog?.Invoke(new ExecutorStreamResult(true, stdErr.Text));
                        stdErrBuffer.AppendLine(stdErr.Text);
                        break;
                    case ExitedCommandEvent exited:
                        exitCode = exited.ExitCode;
                        break;
                }
            }

            if (!exitCode.HasValue)
            {
                throw new CliException($"Cannot find exit code for command {command}");
            }

            return new ExecutorResult
            {
                ExitCode = exitCode.Value,
                IsSuccess = exitCode.Value == 0,
                StdErr = stdErrBuffer.ToString(),
                StdOut = stdOutBuffer.ToString(),
            };
        }
        catch (Win32Exception ex) when (ex.NativeErrorCode == 2)
        {
            return new ExecutorResult
            {
                StdErr = $"Command not found: {command}",
                ExitCode = -1,
                IsSuccess = false,
            };
        }
        catch (Exception ex)
        {
            return new ExecutorResult
            {
                StdErr = $"An error occurred: {ex.Message}",
                ExitCode = -1,
                IsSuccess = false,
            };
        }
    }
}

public record ExecutorStreamResult(bool IsStdErr, string Log);

public class ExecutorResult
{
    public string? StdOut { get; set; }
    public string? StdErr { get; set; }
    public int ExitCode { get; set; }
    public bool IsSuccess { get; set; }
}
