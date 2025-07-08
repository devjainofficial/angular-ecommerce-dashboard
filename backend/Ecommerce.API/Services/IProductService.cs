using Ecommerce.API.Data.Entities;
using Ecommerce.API.DTOs;

namespace Ecommerce.API.Services;

public interface IProductService
{
    Task<List<ProductDto>> GetAllProductsAsync(
        int pageIndex, 
        int pageSize, 
        string? search = null,
        string? sortBy = null,
        string? sortDir = null, 
        CancellationToken cancellationToken = default);
    Task<ProductDto?> GetProductByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<ProductDto> CreateProductAsync(ProductDto product, CancellationToken cancellationToken = default);
    Task<bool> UpdateProductAsync(int id, ProductDto product, CancellationToken cancellationToken = default);
    Task<bool> DeleteProductAsync(int id, CancellationToken cancellationToken = default);
}
