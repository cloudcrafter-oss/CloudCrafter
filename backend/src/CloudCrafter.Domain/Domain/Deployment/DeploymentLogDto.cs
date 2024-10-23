using AutoMapper;
using CloudCrafter.Domain.Entities;

namespace CloudCrafter.Domain.Domain.Deployment;

public class DeploymentLogDto
{
    public required string Message { get; init; }
    public required bool IsError { get; init; }
    public required DateTime At { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<DeploymentLog, DeploymentLogDto>()
                .ForMember(x => x.Message, opt => opt.MapFrom(src => src.Log))
                .ForMember(x => x.At, opt => opt.MapFrom(src => src.Date));
        }
    }
}
