namespace CloudCrafter.DockerCompose.Engine.Exceptions;

public class DockerComposeException : Exception
{
    public DockerComposeException(string message)
        : base(message) { }
}
