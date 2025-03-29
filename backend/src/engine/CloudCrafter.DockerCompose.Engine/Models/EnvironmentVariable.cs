using System.Text.RegularExpressions;

namespace CloudCrafter.DockerCompose.Engine.Models;

public record EnvironmentVariableGroup(string Name, string? Description);

public class EnvironmentVariable
{
    public required string Key { get; init; }
    public required string Value { get; init; }

    public EnvironmentVariableGroup? Group { get; init; }

    private bool RequiresQuoting()
    {
        return Value.Contains(' ')
            || Value.Contains('#')
            || Value.Contains('=')
            || Value.Contains('"')
            || Value.Contains('\'');
    }

    public string EnvFileRepresentation()
    {
        string formattedValue;
        if (Value.Contains('\n'))
        {
            // Prefer single quotes for multiline
            formattedValue = $"'{Value.Replace("'", "\\'")}'";
        }
        else if (RequiresQuoting())
        {
            formattedValue = $"'{Value.Replace("'", "\\'")}'";
        }
        else
        {
            formattedValue = Value;
        }

        return $"{Key}={formattedValue}";
    }

    public static EnvironmentVariable? Parse(string line)
    {
        // Trim whitespace and skip comments
        line = line.Trim();
        if (string.IsNullOrEmpty(line) || line.StartsWith("#"))
        {
            return null;
        }

        // Split the line into key and value
        var parts = line.Split(new[] { '=' }, 2);
        if (parts.Length != 2)
        {
            throw new FormatException($"Invalid environment variable format: {line}");
        }

        var key = parts[0].Trim();
        var value = ParseValue(parts[1].Trim());

        return new EnvironmentVariable { Key = key, Value = value };
    }

    private static string ParseValue(string value)
    {
        // Remove surrounding quotes if present
        if (
            (value.StartsWith("'") && value.EndsWith("'"))
            || (value.StartsWith("\"") && value.EndsWith("\""))
        )
        {
            value = value.Substring(1, value.Length - 2);
        }

        // Handle multiline values
        value = Regex.Unescape(value);

        return value;
    }
}
