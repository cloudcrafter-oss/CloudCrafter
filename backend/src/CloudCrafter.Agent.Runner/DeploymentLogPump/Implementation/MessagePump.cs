using CloudCrafter.Agent.Models.Shared;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Agent.Runner.DeploymentLogPump.Implementation;

public class MessagePump(ILoggerFactory loggerFactory) : IMessagePump
{
    private readonly List<DeploymentMessage> _logEntries = new List<DeploymentMessage>();
    
    public IDeploymentLogger CreateLogger<T>() where T : class
    {
        var logger = loggerFactory.CreateLogger<T>();
        return new ServiceLogger<T>(this, logger);
    }

    public List<DeploymentMessage> GetLogs()
    {
        return _logEntries;
    }
    
    private void AddLogEntry(Type target, string text)
    {
        _logEntries.Add(new DeploymentMessage()
        {
            Message = text,
            Target = target
        });
    }
    
    private class ServiceLogger<T> : IDeploymentLogger where T : class
    {
        private readonly MessagePump _pump;
        private readonly ILogger<T> _logger;

        public ServiceLogger(MessagePump pump, ILogger<T> logger)
        {
            _pump = pump;
            _logger = logger;
        }

        public void LogInfo(string text)
        {
            _pump.AddLogEntry(typeof(T), text);
            _logger.LogInformation(text);
        }
    }
}
