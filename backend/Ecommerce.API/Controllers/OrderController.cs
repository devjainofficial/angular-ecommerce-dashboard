using Ecommerce.API.Data.Entities;
using Ecommerce.API.DTOs;
using Ecommerce.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController(AppDbContext context) : ControllerBase
{
    [HttpPost("place-order")]
    [Authorize]
    public async Task<IActionResult> PlaceOrder([FromBody] OrderDto orderDto, CancellationToken cancellationToken)
    {
        if (orderDto.Items == null || orderDto.Items.Count == 0)
            return BadRequest("Order must have at least one item.");

        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);

        try
        {
            var order = new Order
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                Items = []
            };

            foreach (var itemDto in orderDto.Items)
            {
                var product = await context.Products
                    .FirstOrDefaultAsync(p => p.Id == itemDto.ProductId && p.Stock >= itemDto.Quantity, cancellationToken);

                if (product == null)
                    return BadRequest($"Product {itemDto.ProductId} not found or insufficient stock.");

                product.Stock -= itemDto.Quantity;

                order.Items.Add(new OrderItem
                {
                    ProductId = product.Id,
                    VariantJson = itemDto.Variant != null ? System.Text.Json.JsonSerializer.Serialize(itemDto.Variant) : null,
                    Quantity = itemDto.Quantity,
                    PriceAtOrder = product.Price
                });
            }

            context.Orders.Add(order);
            await context.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            return Ok(new { orderId = order.Id });
        }
        catch
        {
            await transaction.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
