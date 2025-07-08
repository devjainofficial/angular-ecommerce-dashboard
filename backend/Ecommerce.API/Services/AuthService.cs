using Ecommerce.API.DTOs;
using Ecommerce.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Ecommerce.API.Services;

public class AuthService(AppDbContext context, IConfiguration configuration) : IAuthService
{
    public async Task<AuthResult> RegisterAsync(RegisterDto registerDto)
    {
        AppUser? existingUser = await context.Users
            .FirstOrDefaultAsync(u => u.Email == registerDto.Email);

        if (existingUser != null)
        {
            return AuthResult.Failure("User already exists.");
        }

        AppUser user = new()
        {
            FullName = registerDto.FullName,
            Email = registerDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password)
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        var defaultRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "User");
        if (defaultRole != null)
        {
            var userRole = new Microsoft.AspNetCore.Identity.IdentityUserRole<string>
            {
                UserId = user.Id,
                RoleId = defaultRole.Id
            };
            context.UserRoles.Add(userRole);
            await context.SaveChangesAsync();
        }

        string token = GenerateJwtToken(user);

        return AuthResult.Success(token);
    }

    public async Task<AuthResult> LoginAsync(LoginDto loginDto)
    {
        AppUser? user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return AuthResult.Failure("Invalid credentials.");
        }

        string token = GenerateJwtToken(user);

        return AuthResult.Success(token);
    }

    private string GenerateJwtToken(AppUser user)
    {
        JwtSecurityTokenHandler tokenHandler = new();

        byte[] key = Encoding.UTF8.GetBytes(configuration["Jwt:SecretKey"]!);

        List<string?> roles = [.. context.UserRoles
            .Where(ur => ur.UserId == user.Id)
            .Join(context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name)];

        List<Claim> claims =
        [
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.FullName),
            new(ClaimTypes.Email, user.Email ?? string.Empty),
        ];

        foreach (var role in roles)
        {
            if (!string.IsNullOrEmpty(role))
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
        }

        SecurityTokenDescriptor tokenDescriptor = new()
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(1),
            Issuer = configuration["Jwt:Issuer"],
            Audience = configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}

