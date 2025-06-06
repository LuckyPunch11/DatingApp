using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API.Extensoins
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetEmail(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Email)?.Value;
        }

        public static int GetId(this ClaimsPrincipal user)
        {
            return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        }
    }
}