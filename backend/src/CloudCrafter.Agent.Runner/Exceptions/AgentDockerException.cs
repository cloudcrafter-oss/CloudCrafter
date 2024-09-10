namespace CloudCrafter.Agent.Runner.Exceptions;

public class AgentDockerException(string message, Exception? ex = null) : Exception(message, ex) { }
