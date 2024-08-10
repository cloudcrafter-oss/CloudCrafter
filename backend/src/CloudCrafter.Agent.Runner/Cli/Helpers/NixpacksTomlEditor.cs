using System.Text;
using Tomlyn;
using Tomlyn.Syntax;
using Tomlyn.Model;

namespace CloudCrafter.Agent.Runner.Cli.Helpers;

public class NixpacksTomlEditor
{
    private readonly TomlTable _model;

    public NixpacksTomlEditor(string toml)
    {
        _model = Toml.ToModel(toml);
    }

    public void AddVariables(IDictionary<string, string> variables)
    {
        if (!_model.ContainsKey("variables"))
        {
            _model.Add("variables", new TomlTable());
        }

        var variablesTable = (TomlTable)_model["variables"];

        foreach (var variable in variables)
        {
            variablesTable[variable.Key] = variable.Value;
        }
    }

   
    public void AddPackages(IEnumerable<string> packages)
    {
        var phasesTable = (TomlTable)_model["phases"];
        var setupTable = (TomlTable)phasesTable["setup"];

        if (setupTable.ContainsKey("aptPkgs"))
        {
            var aptPkgs = (TomlArray)setupTable["aptPkgs"];

            var packagesToAdd = from zz in packages
                where !aptPkgs.Contains(zz)
                select zz;

            foreach (var package in packagesToAdd)
            {
                aptPkgs.Add(package);
            }
        }
        else
        {
            var aptPackagesTable = new TomlArray();

            foreach (var package in packages)
            {
                aptPackagesTable.Add(package);
            }

            setupTable.Add("aptPkgs", aptPackagesTable);
        }
    }

    public string GetToml()
    {
        return CustomTomlSerializer.Serialize(_model);
    }
}


public static class CustomTomlSerializer
{
    public static string Serialize(TomlTable table)
    {
        var sb = new StringBuilder();
        SerializeTable(table, sb, 0);
        return sb.ToString();
    }

    private static void SerializeTable(TomlTable table, StringBuilder sb, int indent)
    {
        foreach (var kvp in table)
        {
            if (kvp.Value is TomlTable nestedTable)
            {
                sb.AppendLine($"{new string(' ', indent)}[{kvp.Key}]");
                SerializeTable(nestedTable, sb, indent + 2);
            }
            else
            {
                sb.AppendLine($"{new string(' ', indent)}{kvp.Key} = {SerializeValue(kvp.Value)}");
            }
        }
    }

    private static string SerializeValue(object? value)
    {
        return value switch
        {
            string str => $"'{str}'",
            TomlArray arr => $"[{string.Join(", ", arr.Select(SerializeValue))}]",
            _ => value?.ToString() ?? "null"
        };
    }
}

