namespace Ecommerce.API.Models;

public class AuthResult
{
    public bool IsSuccess { get; set; }
    public string? Token { get; set; }
    public string? ErrorMessage { get; set; }

    public static AuthResult Success(string token) => new() { IsSuccess = true, Token = token };
    public static AuthResult Failure(string message) => new() { IsSuccess = false, ErrorMessage = message };
}
