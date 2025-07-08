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
                TotalSales = 23300,
                TotalOrders = 345,
                TotalProducts = context.Products.Count(),
                TotalCustomers = context.Users.Count()
            };
            return Ok(summary);
        }
    }
}
