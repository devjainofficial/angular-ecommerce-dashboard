using Ecommerce.API.DTOs;
using Ecommerce.API.Models;

namespace Ecommerce.API.Services;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(RegisterRequest registerDto);
    Task<AuthResult> LoginAsync(LoginRequest loginDto);
}
