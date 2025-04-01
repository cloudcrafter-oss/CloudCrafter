using CloudCrafter.Domain.Entities;
using FluentValidation;

namespace CloudCrafter.Core.Commands.Stacks.Volumes.Validation;

public class UpdateStackServiceVolumeCommandValidation
    : AbstractValidator<UpdateStackServiceVolumeCommand>
{
    public UpdateStackServiceVolumeCommandValidation()
    {
        RuleFor(x => x.Source)
            .Null()
            .When(x => x.Type == StackServiceVolumeType.DockerVolume)
            .WithMessage("Source can only be used with LocalVolumes");
    }
}
