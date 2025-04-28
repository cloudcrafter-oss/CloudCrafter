using CloudCrafter.Agent.Models.Deployment.Steps.Params.EnvironmentFiles;
using FluentValidation;

namespace CloudCrafter.Agent.Runner.Validators.EnvironmentVariables;

public class WriteEnvironmentVariablesFileToFilesystemParamsValidator
    : AbstractValidator<WriteEnvironmentVariablesFileToFilesystemParams>
{
    public WriteEnvironmentVariablesFileToFilesystemParamsValidator()
    {
        RuleFor(x => x.FileName).NotEmpty().WithMessage("FileName cannot be empty.");
    }
}
