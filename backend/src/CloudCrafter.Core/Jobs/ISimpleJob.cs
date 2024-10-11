namespace CloudCrafter.Core.Jobs;

public interface ISimpleJob<in TArg>
{
    Task HandleAsync(IServiceProvider serviceProvider, TArg arg);
}
