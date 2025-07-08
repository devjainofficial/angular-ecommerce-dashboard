namespace Ecommerce.API.Data.Entities;

public class Order
{
    public int Id { get; set; }
    public string UserId { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public List<OrderItem> Items { get; set; } = [];
}
