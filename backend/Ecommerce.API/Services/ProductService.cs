using Ecommerce.API.Data.Entities;
using Ecommerce.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.API.Services;

public class ProductService(AppDbContext context)
    : IProductService
{
    public async Task<List<ProductDto>> GetAllProductsAsync(CancellationToken cancellationToken)
    {
        return await context.Products
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                ImageUrl = p.ImageUrl
            })
            .ToListAsync(cancellationToken: cancellationToken);
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await context.Products
            .Where(p => p.Id == id)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                ImageUrl = p.ImageUrl
            })
            .FirstOrDefaultAsync(cancellationToken: cancellationToken);
    }

    public async Task<ProductDto> CreateProductAsync(ProductDto request, CancellationToken cancellationToken)
    {
        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock,
            ImageUrl = request.ImageUrl,
            CreatedAt = DateTime.UtcNow,
        };
        context.Products.Add(product);
        await context.SaveChangesAsync(cancellationToken);

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Stock = product.Stock,
            ImageUrl = product.ImageUrl
        };
    }

    public async Task<bool> UpdateProductAsync(int id, ProductDto request, CancellationToken cancellationToken)
    {
        var product = await context.Products.FindAsync([id], cancellationToken: cancellationToken);
        if (product == null) return false;

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.Stock = request.Stock;
        product.ImageUrl = request.ImageUrl;
        product.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteProductAsync(int id, CancellationToken cancellationToken)
    {
        var product = await context.Products.FindAsync([id], cancellationToken: cancellationToken);
        if (product == null) return false;

        context.Products.Remove(product);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
