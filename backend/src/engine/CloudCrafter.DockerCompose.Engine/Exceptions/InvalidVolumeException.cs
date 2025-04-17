namespace CloudCrafter.DockerCompose.Engine.Exceptions;

public class InvalidVolumeException : DockerComposeException
{
    public InvalidVolumeException(string volumeName)
        : base($"Volume '{volumeName}' does not exist in the Docker Compose file.")
    {
        VolumeName = volumeName;
    }

    public string VolumeName { get; }
}
