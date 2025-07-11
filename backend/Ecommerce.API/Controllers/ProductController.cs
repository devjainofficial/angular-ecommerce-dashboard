﻿using Ecommerce.API.DTOs;
using Ecommerce.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController(IProductService productService) : ControllerBase
{
    [HttpGet("get-all-products")]
    public async Task<IActionResult> GetAllProductsAsync(
    [FromQuery] int pageIndex = 1,
    [FromQuery] int pageSize = int.MaxValue,
    [FromQuery] string? search = null,
    [FromQuery] string? sortBy = "name",
    [FromQuery] string? sortDir = "asc",
    CancellationToken cancellationToken = default)
    {
        var products = await productService.GetAllProductsAsync(pageIndex, pageSize, search, sortBy, sortDir, cancellationToken);
        return Ok(products);
    }

    [HttpGet("get-by-productId/{id:int}")]
    public async Task<IActionResult> GetProductByIdAsync(int id)
    {
        ProductDto? product = await productService.GetProductByIdAsync(id);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost("create-product")]
    public async Task<IActionResult> CreateProductAsync([FromBody] ProductDto request)
    {
        ProductDto created = await productService.CreateProductAsync(request);
        return created is null ? BadRequest() : Ok(created);
    }

    [HttpPut("update-product/{id:int}")]
    public async Task<IActionResult> UpdateProductAsync(int id, [FromBody] ProductDto request)
    {
        bool updated = await productService.UpdateProductAsync(id, request);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("delete-product/{id:int}")]
    public async Task<IActionResult> DeleteProductAsync(int id)
    {
        bool deleted = await productService.DeleteProductAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
