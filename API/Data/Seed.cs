using System.Text.Json;
using API.Entities;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
            if (users == null) return;

            var roles = new List<AppRole>
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"}
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                user.Email = user.Email.ToLower();
                await userManager.CreateAsync(user, "password");
                await userManager.AddToRoleAsync(user, "Member");
            }

            var admin = new AppUser
            {
                Email = "admin@admin.com",
                UserName = "Admin"
            };

            await userManager.CreateAsync(admin, "admin");
            await userManager.AddToRolesAsync(admin, ["Admin", "Moderator"]);
        }
    }
}