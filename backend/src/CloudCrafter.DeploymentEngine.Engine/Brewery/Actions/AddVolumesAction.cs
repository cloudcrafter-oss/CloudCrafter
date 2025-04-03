using CloudCrafter.DeploymentEngine.Engine.Abstraction;
using CloudCrafter.DockerCompose.Engine.Yaml;
using CloudCrafter.Domain.Entities;
using Slugify;

namespace CloudCrafter.DeploymentEngine.Engine.Brewery.Actions;

public class AddVolumesAction : BaseAction
{
    public override void Execute(
        BaseDockerComposeGenerator generator,
        DockerComposeEditor editor,
        DockerComposeEditor.ServiceEditor service,
        StackService stackService
    )
    {
        if (stackService.Volumes.Count == 0)
        {
            return;
        }

        List<string> dockerVolumeNames = [];

        foreach (var volume in stackService.Volumes)
        {
            var path =
                volume.Type == StackServiceVolumeType.DockerVolume
                    ? GenerateDockerVolumeName(volume)
                    : volume.SourcePath;

            if (string.IsNullOrEmpty(path))
            {
                throw new Exception(
                    "This should not happen - either your volume has no name or no source path!"
                );
            }

            if (volume.Type == StackServiceVolumeType.DockerVolume)
            {
                dockerVolumeNames.Add(path);
            }

            var destinationPath = volume.DestinationPath;

            if (string.IsNullOrEmpty(destinationPath))
            {
                throw new Exception(
                    "This should not happen - your volume has no destination path!"
                );
            }

            service.AddVolume(path, destinationPath);
        }

        // Add Docker volumes to the editor
        foreach (var dockerVolumeName in dockerVolumeNames)
        {
            var volume = editor.AddVolume(dockerVolumeName);
            volume.SetDriver("local");
        }
    }

    private string GenerateDockerVolumeName(StackServiceVolume volume)
    {
        var helper = new SlugHelper();
        var slugified = helper.GenerateSlug(volume.Name).ToLower();

        // Ensure it starts with a letter or number (prepend 's' if it doesn't)
        if (!char.IsLetterOrDigit(slugified[0]))
        {
            slugified = "s" + slugified;
        }

        return slugified;
    }
}
