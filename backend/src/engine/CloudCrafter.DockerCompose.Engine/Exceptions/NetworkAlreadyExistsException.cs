namespace CloudCrafter.DockerCompose.Engine.Exceptions;

public class NetworkAlreadyExistsException(string networkName) : Exception($"Network {networkName} already exists")
{
    
}
