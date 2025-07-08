namespace Ecommerce.API.Data.Entities;

public class OrderItem
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string? VariantJson { get; set; }
    public int Quantity { get; set; }
    public decimal PriceAtOrder { get; set; }
}
