import { Component } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProductService } from './services/product.service';
import { FormsModule } from '@angular/forms';
import { CartService } from './services/cart.service';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    FormsModule,
    BadgeModule,
    OverlayBadgeModule,
    CommonModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  cartTotalPrice = '0';
  cartTotalItems = 0;
  searchTerm = '';
  path = '';
  routerSubscription: any;
  cartSubscription: any;

  constructor(
    readonly productService: ProductService,
    readonly cartService: CartService,
    readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getCartTotals();
    this.subscribeToRouteChanges();
  }

  subscribeToRouteChanges() {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.path = event.urlAfterRedirects.split('/')[1] || 'products';
      }
    });
  }

  filterProducts() {
    if (this.searchTerm.trim() === '') {
      this.productService.resetProducts();
    } else {
      this.productService.filterProducts(this.searchTerm);
    }
  }
  getCartTotals() {
    this.cartSubscription = this.cartService.cart.subscribe((cart) => {
      this.cartTotalPrice = this.productService.formatPrice(
        cart.reduce(
          (sum, item) => sum + item.price * item.amount * item.minOrderAmount,
          0
        )
      );
      this.cartTotalItems = cart.reduce((sum, item) => sum + item.amount, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
