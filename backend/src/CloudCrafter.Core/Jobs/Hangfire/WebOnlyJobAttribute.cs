using Hangfire.Common;

namespace CloudCrafter.Core.Jobs.Hangfire;

public class WebOnlyJobAttribute : JobFilterAttribute
{
    public WebOnlyJobAttribute()
    {
        this.Order = 1; // Set order if needed
    }
}
