using CloudCrafter.Domain.Domain.SignalR;
using TypeGen.Core.SpecGeneration;

namespace CloudCrafter.Domain.Common.SignalR;

public class SignalRTypesGenerator : GenerationSpec
{
    public override void OnBeforeGeneration(OnBeforeGenerationArgs options)
    {
        options.GeneratorOptions.TypeScriptFileExtension = "ts";
        options.GeneratorOptions.ExportTypesAsInterfacesByDefault = true;
        AddClass<MyHubMessage>();
    }
}
