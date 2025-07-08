import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from './cart.service';
import { Observable } from 'rxjs';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  cart$: Observable<CartItem[]>;

  constructor(private cartService: CartService, private toast: ToastService) {
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
    this.clear();
    this.showCheckout = false;
    this.checkoutSuccess = true;
    this.toast.showSuccess('Checkout successful!');
  }
} 