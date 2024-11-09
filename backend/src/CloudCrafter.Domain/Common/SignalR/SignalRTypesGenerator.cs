using CloudCrafter.Agent.Models.SignalR;
using CloudCrafter.Agent.SignalR.Models;
using CloudCrafter.Domain.Domain.Deployment;
using CloudCrafter.Domain.Domain.Health;
using TypeGen.Core.SpecGeneration;

namespace CloudCrafter.Domain.Common.SignalR;

public class SignalRTypesGenerator : GenerationSpec
{
    public override void OnBeforeGeneration(OnBeforeGenerationArgs options)
    {
        options.GeneratorOptions.TypeScriptFileExtension = "ts";

        AddInterface<DeploymentLogDto>();
        AddInterface<EntityHealthDto>();
    }
}
