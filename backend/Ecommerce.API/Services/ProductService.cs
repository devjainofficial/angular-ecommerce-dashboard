using Ecommerce.API.Data.Entities;
using Ecommerce.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Services;

public class ProductService(AppDbContext context) : IProductService
{
    public async Task<List<ProductDto>> GetAllProductsAsync(
         int pageIndex = 1,
         int pageSize = int.MaxValue,
         string? search = null,
         CancellationToken token = default)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(pageIndex, 1);
        ArgumentOutOfRangeException.ThrowIfLessThan(pageSize, 1);

        IQueryable<Product> query = context.Products
            .AsNoTracking()
            .Include(p => p.Variants)
            .Where(p => p.Stock > 0 && p.DeletedAt == null);

        if (!string.IsNullOrWhiteSpace(search))
        {
            string s = search.Trim().ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(s) ||
                p.Description.ToLower().Contains(s) ||
                p.Price.ToString().ToLower().Contains(s)
            );
        }

        query = query.OrderBy(p => p.Name)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize);

        List<Product> products = await query.ToListAsync(token);

        return [.. products.Select(ToDto)];
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id, CancellationToken token = default)
    {
        return await context.Products
            .AsNoTracking()
            .Include(p => p.Variants)
            .Where(p => p.Id == id && p.DeletedAt == null)
            .Select(p => ToDto(p))
            .FirstOrDefaultAsync(token);
    }

    public async Task<ProductDto> CreateProductAsync(ProductDto request, CancellationToken token = default)
    {
        Product? product = new()
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock,
            ImageUrl = request.ImageUrl,
            CreatedAt = DateTime.UtcNow,
            Variants = request.Variants?.Select(ToEntity).ToList() ?? []
        };

        context.Products.Add(product);
        await context.SaveChangesAsync(token);

        return ToDto(product);
    }

    public async Task<bool> UpdateProductAsync(int id, ProductDto request, CancellationToken token = default)
    {
        Product? product = await context.Products
                                   .Include(p => p.Variants)
                                   .FirstOrDefaultAsync(p => p.Id == id, token);

        if (product is null) return false;

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.Stock = request.Stock;
        product.ImageUrl = request.ImageUrl;
        product.UpdatedAt = DateTime.UtcNow;

        product.Variants.Clear();

        if (request.Variants != null)
        {
            foreach (var v in request.Variants)
                product.Variants.Add(ToEntity(v));
        }

        await context.SaveChangesAsync(token);
        return true;
    }

    public async Task<bool> DeleteProductAsync(int id, CancellationToken token = default)
    {
        Product? product = await context.Products.FindAsync([id], token);

        if (product is null) return false;

        product.DeletedAt = DateTime.UtcNow;
        
        await context.SaveChangesAsync(token);
        
        return true;
    }

    private static ProductDto ToDto(Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        Price = p.Price,
        Stock = p.Stock,
        ImageUrl = p.ImageUrl,
        Variants = p.Variants?.Select(v => new ProductVariantDto
        {
            Size = v.Size,
            Color = v.Color,
            SKU = v.SKU,
            PriceDiff = v.PriceDiff
        }).ToList()
    };

    private static ProductVariant ToEntity(ProductVariantDto v) => new()
    {
        Size = v.Size,
        Color = v.Color,
        SKU = v.SKU,
        PriceDiff = v.PriceDiff
    };
}
