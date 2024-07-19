using CloudCrafter.Agent.Runner.Cli.Helpers;

namespace CloudCrafter.Agent.Runner.Tests.Cli.Helpers;

public class NixpacksTomlEditorTest
{
    [Test]
    public Task ShouldBeAbleToAddPackages()
    {
        var editor = new NixpacksTomlEditor(GetNixpacksTomlWithNoAptPkgs());
        editor.AddPackages(["wget", "curl"]);

        var toml = editor.GetToml();

        return Verify(toml);
    }

    [Test]
    public Task ShouldBeAbleToAddPackagesToExistingAptPkgs()
    {
        var editor = new NixpacksTomlEditor(GetNixpacksTomlWithExistingAptPkgs());
        editor.AddPackages(["wget", "curl", "nano"]);

        var toml = editor.GetToml();

        return Verify(toml);
    }


    private string GetNixpacksTomlWithNoAptPkgs()
    {
        var toml = """
                   providers = []
                   buildImage = 'ghcr.io/railwayapp/nixpacks:ubuntu-1716249803'

                   [variables]
                   CI = 'true'
                   NIXPACKS_METADATA = 'node'
                   NODE_ENV = 'production'
                   NPM_CONFIG_PRODUCTION = 'false'
                   [phases.build]
                   dependsOn = ['install']
                   cacheDirectories = ['node_modules/.cache']

                   [phases.install]
                   dependsOn = ['setup']
                   cmds = ['npm i']
                   cacheDirectories = ['/root/.npm']
                   paths = ['/app/node_modules/.bin']

                   [phases.setup]
                   nixPkgs = [
                       'nodejs_18',
                       'npm-9_x',
                   ]
                   nixOverlays = ['https://github.com/railwayapp/nix-npm-overlay/archive/main.tar.gz']
                   nixpkgsArchive = 'bdd2f439c62aa0b8aa97f5c784a965c23f968fe6'

                   [start]
                   cmd = 'npm run start'

                   """;

        return toml;
    }
    
    
    private string GetNixpacksTomlWithExistingAptPkgs()
    {
        var toml = """
                   providers = []
                   buildImage = 'ghcr.io/railwayapp/nixpacks:ubuntu-1716249803'

                   [variables]
                   CI = 'true'
                   NIXPACKS_METADATA = 'node'
                   NODE_ENV = 'production'
                   NPM_CONFIG_PRODUCTION = 'false'
                   [phases.build]
                   dependsOn = ['install']
                   cacheDirectories = ['node_modules/.cache']

                   [phases.install]
                   dependsOn = ['setup']
                   cmds = ['npm i']
                   cacheDirectories = ['/root/.npm']
                   paths = ['/app/node_modules/.bin']

                   [phases.setup]
                   nixPkgs = [
                       'nodejs_18',
                       'npm-9_x',
                   ]
                   aptPkgs = ["curl"]
                   nixOverlays = ['https://github.com/railwayapp/nix-npm-overlay/archive/main.tar.gz']
                   nixpkgsArchive = 'bdd2f439c62aa0b8aa97f5c784a965c23f968fe6'

                   [start]
                   cmd = 'npm run start'

                   """;

        return toml;
    }
}
