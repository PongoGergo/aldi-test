import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product.i';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../interfaces/cart.i';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);

  constructor() {}

  addToCartIfHasAvailableAmount(product: Product) {
    const currentCart = this.cart.getValue();
    const productInCart = currentCart.find((p) => p.id === product.id);
    console.log(product.id);
    if (
      productInCart &&
      productInCart.amount * product.minOrderAmount + product.minOrderAmount >
        product.availableAmount
    ) {
      return;
    }
    if (productInCart) {
      productInCart.amount += 1;
    } else {
      currentCart.push({ ...product, amount: 1 });
    }
    console.log(currentCart);

    this.cart.next([...currentCart]);
  }

  removeFromCart(productId: number) {
    const currentCart = this.cart.getValue();
    const updatedCart = currentCart.filter((p) => p.id !== productId);
    this.cart.next(updatedCart);
  }

  removeOneFromCart(productId: number) {
    const currentCart = this.cart.getValue();
    const productInCart = currentCart.find((p) => p.id === productId);

    if (productInCart) {
      if (
        productInCart.amount * productInCart.minOrderAmount >
        productInCart.minOrderAmount
      ) {
        productInCart.amount -= 1;
        this.cart.next([...currentCart]);
      } else {
        this.removeFromCart(productId);
      }
    }
  }

  updateCartItem(updatedItem: CartItem) {
    const currentCart = this.cart.getValue();
    const itemIndex = currentCart.findIndex((p) => p.id === updatedItem.id);

    if (itemIndex !== -1) {
      currentCart[itemIndex] = updatedItem;
      this.cart.next([...currentCart]);
    }
  }

  clearCart() {
    this.cart.next([]);
  }
}
