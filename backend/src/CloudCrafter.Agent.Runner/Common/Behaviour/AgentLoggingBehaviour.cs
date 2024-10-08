using CloudCrafter.Agent.Runner.Common.Interfaces;
using CloudCrafter.Agent.Runner.Logging;
using MediatR;
using Microsoft.Extensions.Logging;
using Serilog.Context;

namespace CloudCrafter.Agent.Runner.Common.Behaviour;

public class AgentLoggingBehaviour<TRequest, TResponse>(ILogger<TRequest> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        if (request is not IAgentLoggable agentLoggable)
        {
            return await next();
        }

        var guidScope = agentLoggable.ChannelId;

        using (LogContext.PushProperty("ChannelId", guidScope))
        {
            logger.LogInformation(
                "Starting request {RequestType} for channel {ChannelId}",
                typeof(TRequest).Name,
                guidScope
            );

            var response = await next();

            // Wrap the next delegate in a new scope to ensure the LogContext is preserved

            logger.LogInformation(
                "Completed request {RequestType} for deployment {ChannelId}",
                typeof(TRequest).Name,
                guidScope
            );
            return response;
        }
    }
}
