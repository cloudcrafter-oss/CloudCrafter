namespace CloudCrafter.DockerCompose.Engine.Exceptions;

public class VolumeAlreadyExistsException : DockerComposeException
{
    public VolumeAlreadyExistsException(string volumeName)
        : base($"Volume '{volumeName}' already exists in the Docker Compose file.")
    {
        VolumeName = volumeName;
    }

    public string VolumeName { get; }
}
