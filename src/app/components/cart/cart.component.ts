import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../interfaces/cart.i';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    DataViewModule,
    InputNumber,
    FormsModule,
    ButtonModule,
    InputIconModule,
    IconFieldModule,
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart: CartItem[] = [];
  totalPrice = '0';
  totalItems: number = 0;
  cartSubscription: any;

  constructor(
    readonly cartService: CartService,
    readonly productService: ProductService
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartSubscription = this.cartService.cart.subscribe((cart) => {
      this.cart = cart;
      this.calculateTotals();
    });
  }

  calculateTotals() {
    let totalPrice = this.cart.reduce(
      (sum, item) => sum + item.price * item.amount * item.minOrderAmount,
      0
    );

    this.totalPrice = this.productService.formatPrice(totalPrice);
    this.totalItems = this.cart.reduce((sum, item) => sum + item.amount, 0);
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
    this.calculateTotals();
  }

  updateCartItem(updatedItem: CartItem) {
    this.cartService.updateCartItem(updatedItem);
    this.calculateTotals();
  }

  clearCart() {
    this.cartService.clearCart();
  }
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/No-Image-Placeholder.svg';
  }

  ngOnDestroy(): void {
    this.cartSubscription ? this.cartSubscription.unsubscribe() : null;
  }
}
