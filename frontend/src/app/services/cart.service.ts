import { Product } from './product.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isBrowser } from '../../../helpers';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<Product[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  private currentUserId: string | null = null;

  constructor(private auth: AuthService) {
    if (isBrowser()) {
      this.currentUserId = localStorage.getItem('userId');
      this.cartItemsSubject.next(this.getCartItems());

      this.auth.isLoggedIn.subscribe(loggedIn => {
        const newUserId = localStorage.getItem('userId');
        if (loggedIn) {
          if (newUserId !== this.currentUserId) {
            this.currentUserId = newUserId;
            this.cartItemsSubject.next(this.getCartItems());
          }
        } else {
          this.clearCart();
        }
      });
    }
  }

  addToCart(product: Product) {
    const currentItems = this.getCartItems();
    const existingProduct = currentItems.find(item => item._id === product._id);

    if (existingProduct) {
      existingProduct.adet += 1;
    } else {
      product.adet = 1;
      currentItems.push(product);
    }

    if (isBrowser()) {
      localStorage.setItem(this.getCartKey(), JSON.stringify(currentItems));
    }
    this.cartItemsSubject.next(currentItems);
  }

  private getCartKey(): string {
    const userId = localStorage.getItem('userId');
    return userId ? `shopping_cart_${userId}` : 'shopping_cart';
  }

  getCartItems(): Product[] {
    if (isBrowser()) {
      const cartItems = localStorage.getItem(this.getCartKey());
      return cartItems ? JSON.parse(cartItems) : [];
    }
    return [];
  }

  removeFromCart(productId: string) {
    const currentItems = this.getCartItems();
    const productIndex = currentItems.findIndex(item => item._id === productId);

    if (productIndex > -1) {
      const product = currentItems[productIndex];
      if (product.adet > 1) {
        product.adet -= 1;
      } else {
        currentItems.splice(productIndex, 1);
      }
    }

    if (isBrowser()) {
      localStorage.setItem(this.getCartKey(), JSON.stringify(currentItems));
    }
    this.cartItemsSubject.next(currentItems);
  }

  clearCart() {
    if (isBrowser()) {
      localStorage.removeItem(this.getCartKey());
    }
    this.cartItemsSubject.next([]);
  }
}
