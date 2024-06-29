using Ardalis.Result;
using Ardalis.SharedKernel;

namespace CloudCrafter.UseCases.Contributors.Delete;

public record DeleteContributorCommand(int ContributorId) : ICommand<Result>;
