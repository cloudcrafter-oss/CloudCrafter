using CloudCrafter.Domain.Common.SignalR;
using CloudCrafter.Web.Infrastructure;
using TypeGen.Core.Generator;

namespace CloudCrafter.Web.Endpoints;

/// <summary>
///     This only runs during Development
/// </summary>
public class Development : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        if (!app.Environment.IsDevelopment())
        {
            return;
        }

        app.MapGroup(this, withOpenApi: false)
            .MapGet(GenerateSignalRTypes, "generate-signalr-types");
    }

    public async Task<Dictionary<string, string>> GenerateSignalRTypes()
    {
        var generator = new Generator();

        var files = new Dictionary<string, string>();

        generator.UnsubscribeDefaultFileContentGeneratedHandler();
        generator.FileContentGenerated += (sender, args) =>
        {
            files.Add(args.FilePath, args.FileContent);
        };
        var result = await generator.GenerateAsync(new SignalRTypesGenerator());

        return files;
    }
}
