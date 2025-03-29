using System.Text;

namespace CloudCrafter.DockerCompose.Engine.Models;

public class EnvironmentVariableCollection
{
    public EnvironmentVariableCollection()
    {
        Variables = new List<EnvironmentVariable>();
    }

    public EnvironmentVariableCollection(List<EnvironmentVariable> variables)
    {
        Variables = variables;
    }

    public List<EnvironmentVariable> Variables { get; set; }

    public string GetFileContents()
    {
        var sb = new StringBuilder();

        foreach (var variable in Variables)
        {
            sb.AppendLine(variable.EnvFileRepresentation());
        }

        return sb.ToString();
    }

    public void WriteToFile(string filePath)
    {
        File.WriteAllText(filePath, GetFileContents());
    }

    public static EnvironmentVariableCollection ReadFromFile(string filePath)
    {
        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException(
                $"The env file at {filePath} does not exist.",
                filePath
            );
        }

        var variables = new List<EnvironmentVariable>();
        var fileContent = File.ReadAllText(filePath);

        // State for parsing
        bool inSingleQuote = false;
        bool inDoubleQuote = false;
        bool escaped = false;
        var currentLine = new StringBuilder();

        // Process the file character by character to handle multi-line variables
        for (int i = 0; i < fileContent.Length; i++)
        {
            char c = fileContent[i];
            char? nextChar = i < fileContent.Length - 1 ? fileContent[i + 1] : null;

            // Handle escape sequences
            if (c == '\\' && !escaped)
            {
                escaped = true;
                currentLine.Append(c);
                continue;
            }

            // Handle quotes
            if (c == '\'' && !escaped && !inDoubleQuote)
            {
                inSingleQuote = !inSingleQuote;
            }
            else if (c == '"' && !escaped && !inSingleQuote)
            {
                inDoubleQuote = !inDoubleQuote;
            }

            // Handle newlines
            if (c == '\n' || c == '\r')
            {
                // If we're inside quotes, this is part of a multi-line value
                if (inSingleQuote || inDoubleQuote)
                {
                    currentLine.Append(c);
                }
                // If we're at a line end and not in quotes, process the line
                else if (c == '\n' || (c == '\r' && nextChar != '\n'))
                {
                    string line = currentLine.ToString().Trim();
                    if (!string.IsNullOrEmpty(line) && !line.StartsWith("#"))
                    {
                        try
                        {
                            var variable = EnvironmentVariable.Parse(line);
                            if (variable != null)
                            {
                                variables.Add(variable);
                            }
                        }
                        catch (FormatException ex)
                        {
                            // Log or handle the exception as needed
                            Console.WriteLine($"Error parsing line: {ex.Message}");
                        }
                    }
                    currentLine.Clear();
                }
                // Skip \r in \r\n sequence
                else if (c == '\r' && nextChar == '\n')
                {
                    // Skip this character, will process \n next
                }
            }
            else
            {
                currentLine.Append(c);
            }

            escaped = false;
        }

        // Process any remaining content
        string remainingLine = currentLine.ToString().Trim();
        if (!string.IsNullOrEmpty(remainingLine) && !remainingLine.StartsWith("#"))
        {
            try
            {
                var variable = EnvironmentVariable.Parse(remainingLine);
                if (variable != null)
                {
                    variables.Add(variable);
                }
            }
            catch (FormatException ex)
            {
                // Log or handle the exception as needed
                Console.WriteLine($"Error parsing line: {ex.Message}");
            }
        }

        return new EnvironmentVariableCollection(variables);
    }
}
