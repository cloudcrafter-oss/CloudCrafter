using Ardalis.Result;
using Microsoft.AspNetCore.Identity;

namespace CloudCrafter.Infrastructure.Identity;

public static class IdentityResultExtensions
{
    public static Result ToApplicationResult(this IdentityResult result)
    {
        return result.Succeeded
            ? Result.Success()
            : Result.Error(result.Errors.Select(e => e.Description).ToArray());
    }
}
