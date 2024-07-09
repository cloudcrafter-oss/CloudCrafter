namespace CloudCrafter.DockerCompose.Engine.Exceptions;

public class ServiceAlreadyExistsException : Exception
{
    public ServiceAlreadyExistsException(string serviceName) : base($"Service {serviceName} already exists")
    {
    }
}
