namespace CloudCrafter.DockerCompose.Engine.Exceptions;

public class InvalidServiceException : Exception
{
    public InvalidServiceException(string serviceName) : base($"Service {serviceName} is invalid")
    {
    }
}
