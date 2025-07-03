using Ecommerce.API.DTOs;
using Ecommerce.API.Models;
using Ecommerce.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto request)
    {
        AuthResult result = await authService.RegisterAsync(request);

        if (!result.IsSuccess)
            return BadRequest(new { message = result.ErrorMessage });

        return Ok(new { token = result.Token });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto request)
    {
        AuthResult result = await authService.LoginAsync(request);

        if (!result.IsSuccess)
            return Unauthorized(new { message = result.ErrorMessage });

        return Ok(new { token = result.Token });
    }

}
