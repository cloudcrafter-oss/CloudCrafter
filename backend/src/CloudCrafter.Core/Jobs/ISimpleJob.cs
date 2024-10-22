namespace CloudCrafter.Core.Jobs;

public interface ISimpleJob
{
    Task HandleAsync(IServiceProvider serviceProvider);
}
