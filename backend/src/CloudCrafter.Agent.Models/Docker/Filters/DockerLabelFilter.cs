namespace CloudCrafter.Agent.Models.Docker.Filters;

public class DockerLabelFilter
{
    public required string Key { get; set; }
    public required string Operator { get; set; }
    public required string Value { get; set; }

    public static DockerLabelFilter Parse(string filterString)
    {
        var parts = filterString.Split(new[] { "=", "!=" }, 2, StringSplitOptions.RemoveEmptyEntries);

        if (parts.Length != 2)
        {
            throw new ArgumentException("Invalid filter string format", nameof(filterString));
        }

        return new DockerLabelFilter
        {
            Key = parts[0].Trim(), Operator = filterString.Contains("!=") ? "!=" : "=", Value = parts[1].Trim()
        };
    }

    public static bool TryParse(string filterString, out DockerLabelFilter? filter)
    {
        try
        {
            filter = Parse(filterString);
            return true;
        }
        catch
        {
            filter = null;
            return false;
        }
    }

    public override string ToString()
    {
        return $"{Key}{Operator}{Value}";
    }
}
