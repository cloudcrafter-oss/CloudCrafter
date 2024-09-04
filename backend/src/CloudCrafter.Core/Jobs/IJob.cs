namespace CloudCrafter.Core.Jobs;

public interface IJob
{
    Task Handle(IServiceProvider serviceProvider);
}
