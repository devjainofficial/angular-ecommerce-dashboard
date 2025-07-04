namespace Ecommerce.API.Data.Entities;

public class ProductVariant
{
    public int Id { get; set; }

    public string? Size { get; set; }

    public string? Color { get; set; }

    public string? SKU { get; set; }

    public decimal? PriceDiff { get; set; }

    public int ProductId { get; set; }

    public Product Product { get; set; } = null!;
}
