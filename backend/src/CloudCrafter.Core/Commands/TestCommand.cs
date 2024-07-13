using CloudCrafter.Core.Jobs.Dispatcher;
using CloudCrafter.Jobs.Service;
using MediatR;

namespace CloudCrafter.Core.Commands;

public static class TestCommand
{
    public record Query(bool Fail) : IRequest;

    private class Handler(ICloudCrafterDispatcher dispatcher) : IRequestHandler<Query>
    {
        public Task Handle(Query request, CancellationToken cancellationToken)
        {
            Console.WriteLine("Hello from TestCommand");
            if (request.Fail)
            {
                JobTesting.FireFailJob();
            }
            else
            {
                return dispatcher.DispatchServerConnectivityChecks();
            }

            return Task.CompletedTask;
        }
    }
}
