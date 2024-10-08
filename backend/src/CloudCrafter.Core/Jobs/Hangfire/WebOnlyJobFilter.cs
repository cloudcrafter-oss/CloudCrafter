using CloudCrafter.Core.Interfaces;
using Hangfire.Client;
using Hangfire.Common;
using Hangfire.Server;
using Microsoft.Extensions.Logging;

namespace CloudCrafter.Core.Jobs.Hangfire;

public class WebOnlyJobFilter(
    ICloudCrafterEnvironmentConfig environmentConfig,
    ILogger<WebOnlyJobFilter> logger
) : JobFilterAttribute, IClientFilter, IServerFilter
{
    private readonly bool _isApiHost = environmentConfig.IsApiHost();

    public void OnCreating(CreatingContext context) { }

    public void OnCreated(CreatedContext context) { }

    public void OnPerforming(PerformingContext context)
    {
        var hasAttribute = context
            .BackgroundJob.Job.Method.GetCustomAttributes(typeof(WebOnlyJobAttribute), true)
            .Any();
        if (hasAttribute && !_isApiHost)
        {
            logger.LogCritical("Job is not allowed to run on this host.");
            context.Canceled = true;
        }
    }

    public void OnPerformed(PerformedContext context) { }
}
