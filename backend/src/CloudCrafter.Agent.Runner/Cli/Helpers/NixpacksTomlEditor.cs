using Tomlyn;
using Tomlyn.Model;

namespace CloudCrafter.Agent.Runner.Cli.Helpers;

public class NixpacksTomlEditor
{
    private readonly TomlTable _model;

    public NixpacksTomlEditor(string toml)
    {
        _model = Toml.ToModel(toml);
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
            setupTable.Add("aptPkgs", packages);
        }
    }

    public string GetToml()
    {
        return Toml.FromModel(_model);
    }
}
