using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.DockerCompose.Engine.Yaml;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.DockerCompose;

public class SimpleAppGenerator(BaseDockerComposeGenerator.Args args) : BaseDockerComposeGenerator(args)
{
    public override DockerComposeEditor Generate()
    {
        ValidateGenerator();

        var firstService = Options.Stack.Services.FirstOrDefault();
        // Should be validated, but just in case.
        if (firstService == null)
        {
            throw new InvalidOperationException(
                "SimpleAppGenerator can only be used with stacks that have at least one service.");
        }


        var editor = new DockerComposeEditor();


        var dockerComposeServiceName = firstService.Name;

        var service = editor.AddService(dockerComposeServiceName);


        return editor;
    }

    public override void ValidateGenerator()
    {
        // This generator only should be used with simple, one service stacks.
        // TODO: Move this validation to somewhere else. It's not the job of the SimpleAppGenerator to validate the stack.
        if (Options.Stack.Services.Count != 1)
        {
            throw new InvalidOperationException(
                "SimpleAppGenerator can only be used with stacks that have exactly one service.");
        }
    }
}
