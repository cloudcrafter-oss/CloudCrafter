namespace CloudCrafter.DockerCompose.Engine.Exceptions;

public class InvalidNetworkException(string networkName) : Exception($"Network {networkName} is invalid")
{
    
}
