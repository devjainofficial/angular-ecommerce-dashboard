import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from './cart.service';
import { Observable } from 'rxjs';
import { ToastService } from '../../shared/toast.service';
import { OrderService, OrderDto, OrderItemDto } from '../../orders/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  cart$: Observable<CartItem[]>;

  constructor(private cartService: CartService, private toast: ToastService, private orderService: OrderService) {
    this.cart$ = this.cartService.cart$;
  }

  remove(item: CartItem) {
    this.cartService.removeFromCart(item.product, item.variant);
  }

  clear() {
    this.cartService.clearCart();
  }

  getTotal(cart: CartItem[]): number {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  showCheckout = false;
  checkoutSuccess = false;

  checkout() {
    this.cart$.subscribe(cart => {
      if (cart.length === 0) {
        this.toast.showError('Cart is empty!');
        return;
      }
      const order: OrderDto = {
        items: cart.map(item => ({
          productId: item.product.id!,
          variant: item.variant,
          quantity: item.quantity
        }))
      };
      this.orderService.placeOrder(order).subscribe({
        next: () => {
          this.clear();
          this.showCheckout = false;
          this.checkoutSuccess = true;
          this.toast.showSuccess('Order placed successfully!');
        },
        error: () => {
          this.toast.showError('Failed to place order.');
        }
      });
    }).unsubscribe();
  }
} 