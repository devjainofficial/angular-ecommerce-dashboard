using Ecommerce.API.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController(AppDbContext context) : ControllerBase
    {
        [HttpGet("summary")]
        public IActionResult GetDashboardSummary()
        {
            var summary = new DashboardSummaryDto
            {
                TotalSales = context.OrderItems.Sum(oi => oi.PriceAtOrder), 
                TotalOrders = context.Orders.Count(),
                TotalProducts = context.Products.Where(p => p.DeletedAt == null).Count(),
                TotalCustomers = context.Users.Count()
            };
            return Ok(summary);
        }
    }
}
