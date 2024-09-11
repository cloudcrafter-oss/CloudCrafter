using System.Reflection;
using AutoMapper;

namespace CloudCrafter.Domain.UnitTests.Mappers;

public abstract class BaseMapperTest
{
    protected readonly MapperConfiguration _configuration;
    protected readonly IMapper _mapper;

    public BaseMapperTest()
    {
        _configuration = new MapperConfiguration(config =>
            config.AddMaps(Assembly.GetAssembly(typeof(IDomainTarget)))
        );

        _mapper = _configuration.CreateMapper();
    }
}
