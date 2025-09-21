import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product.i';
import { ProductItemComponent } from '../product-item/product-item.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  imports: [ProductItemComponent, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  productsSubscription: any;

  constructor(
    readonly productService: ProductService,
    readonly cartService: CartService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productsSubscription = this.productService.filteredProducts.subscribe(
      (products) => {
        this.products = products;
      }
    );
  }

  addToCart(product: Product) {
    this.cartService.addToCartIfHasAvailableAmount(product);
  }
  ngOnDestroy(): void {
    this.productsSubscription ? this.productsSubscription.unsubscribe() : null;
  }
}
