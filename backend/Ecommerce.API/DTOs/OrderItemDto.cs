namespace Ecommerce.API.DTOs;
public class OrderItemDto
{
    public int ProductId { get; set; }
    public ProductVariantDto? Variant { get; set; }
    public int Quantity { get; set; }
}