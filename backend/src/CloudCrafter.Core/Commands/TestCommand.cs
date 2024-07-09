using CloudCrafter.Jobs.Service;
using MediatR;

namespace CloudCrafter.Core.Commands;

public static class TestCommand
{
    public record Query() : IRequest;

    private class Handler : IRequestHandler<Query>
    {
        public Task Handle(Query request, CancellationToken cancellationToken)
        {
            Console.WriteLine("Hello from TestCommand");
            JobTesting.Fire();
            
            return Task.CompletedTask;
        }
    }
}
