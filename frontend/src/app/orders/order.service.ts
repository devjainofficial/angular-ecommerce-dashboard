import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItemDto {
  productId: number;
  variant?: any;
  quantity: number;
}
export interface OrderDto {
  items: OrderItemDto[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private base = 'https://localhost:44307/api/orders';
  constructor(private http: HttpClient) {}
  placeOrder(order: OrderDto): Observable<any> {
    return this.http.post(`${this.base}/place-order`, order);
  }
} 