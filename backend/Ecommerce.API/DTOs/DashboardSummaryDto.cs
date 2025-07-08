namespace Ecommerce.API.DTOs;
public class DashboardSummaryDto
{
    public decimal TotalSales { get; set; }
    public int TotalOrders { get; set; }
    public int TotalProducts { get; set; }
    public int TotalCustomers { get; set; }
}
