using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Agent.Runner.Common.Behaviour;

public class PerformanceBehaviour<TRequest, TResponse>(ILogger<TRequest> logger) : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    private readonly Stopwatch _timer = new();
    
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        _timer.Start();

        var response = await next();
        
        _timer.Stop();


        var elapsedMilliseconds = _timer.ElapsedMilliseconds;
        
        logger.LogDebug("CloudCrafter Agent Running Request: {Name} ({ElapsedMilliseconds} milliseconds)", typeof(TRequest).Name, elapsedMilliseconds);

        return response;
    }
}
