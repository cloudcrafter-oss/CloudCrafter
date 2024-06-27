using Ardalis.Result;
using Ardalis.SharedKernel;

namespace CloudCrafter.UseCases.Contributors.Get;

public record GetContributorQuery(int ContributorId) : IQuery<Result<ContributorDTO>>;
