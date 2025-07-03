using Ecommerce.API.DTOs;
using Ecommerce.API.Models;

namespace Ecommerce.API.Services;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(RegisterDto registerDto);
    Task<AuthResult> LoginAsync(LoginDto loginDto);
}
