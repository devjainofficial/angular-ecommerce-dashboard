namespace Ecommerce.API.DTOs;

public class OrderDto
{
    public List<OrderItemDto> Items { get; set; } = new();
}
