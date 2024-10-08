using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Agent.SignalR.Models;
using TypeGen.Core.SpecGeneration;

namespace CloudCrafter.Domain.Common.SignalR;

public class SignalRTypesGenerator : GenerationSpec
{
    public override void OnBeforeGeneration(OnBeforeGenerationArgs options)
    {
        options.GeneratorOptions.TypeScriptFileExtension = "ts";

        AddInterface<MyHubMessage>();
        AddInterface<DeploymentOutputArgs>();
    }
}
