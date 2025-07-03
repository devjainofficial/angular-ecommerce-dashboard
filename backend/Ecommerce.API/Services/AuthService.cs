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

        AppUser user = new ()
        {
            FullName = registerDto.FullName,
            Email = registerDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password)
        };

        context.Users.Add(user);

        await context.SaveChangesAsync();

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
        JwtSecurityTokenHandler tokenHandler = new ();

        byte[] key = Encoding.UTF8.GetBytes(configuration["Jwt:SecretKey"]!);

        SecurityTokenDescriptor tokenDescriptor = new ()
        {
            Subject = new ClaimsIdentity(
            [
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty)
            ]),
            Expires = DateTime.UtcNow.AddHours(3),
            Issuer = configuration["Jwt:Issuer"],
            Audience = configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}

