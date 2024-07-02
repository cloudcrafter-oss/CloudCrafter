using CloudCrafter.Core.Common.Interfaces;
using CloudCrafter.Core.Interfaces.Repositories;
using CloudCrafter.Infrastructure.Core.Configuration;
using CloudCrafter.Infrastructure.Repositories;
using CloudCrafter.Web.Infrastructure.Services;

namespace CloudCrafter.Web.Infrastructure;

public static class WebExtensions
{
    public static IServiceCollection AddWebConfig(this IServiceCollection services, ConfigurationManager config)
    {
        

        services.AddHttpContextAccessor();
 
      
        return services;
    }
}
