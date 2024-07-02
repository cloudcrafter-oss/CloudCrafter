using System.Security.Claims;
using CloudCrafter.Core.Common.Interfaces;

namespace CloudCrafter.Web.Infrastructure.Services;

public class CurrentUser(IHttpContextAccessor httpContextAccessor) : IUser
{
    public Guid? Id
    {
        get
        {
            var id = httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            var claims = httpContextAccessor.HttpContext?.User?.Claims;
            if (string.IsNullOrWhiteSpace(id))
            {
                return null;
            }
            
            return Guid.Parse(id);
        }
    }
}
