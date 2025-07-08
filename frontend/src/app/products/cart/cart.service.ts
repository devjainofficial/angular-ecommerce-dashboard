import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product, ProductVariant } from '../product.model';

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

const CART_STORAGE_KEY = 'cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject: BehaviorSubject<CartItem[]>;

  cart$;

  constructor() {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    const initialCart: CartItem[] = saved ? JSON.parse(saved) : [];
    this.cartSubject = new BehaviorSubject<CartItem[]>(initialCart);
    this.cart$ = this.cartSubject.asObservable();

    this.cart$.subscribe(cart => {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    });
  }

  getCart(): CartItem[] {
    return this.cartSubject.value;
  }

  addToCart(product: Product, variant?: ProductVariant, quantity: number = 1) {
    const cart = this.getCart();
    const idx = cart.findIndex(item => item.product.id === product.id && (!variant || JSON.stringify(item.variant) === JSON.stringify(variant)));
    if (idx > -1) {
      cart[idx].quantity += quantity;
    } else {
      cart.push({ product, variant, quantity });
    }
    this.cartSubject.next([...cart]);
  }

  removeFromCart(product: Product, variant?: ProductVariant) {
    const cart = this.getCart().filter(item => !(item.product.id === product.id && (!variant || JSON.stringify(item.variant) === JSON.stringify(variant))));
    this.cartSubject.next(cart);
  }

  clearCart() {
    this.cartSubject.next([]);
  }
}