import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../interfaces/product.i';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-product-item',
  imports: [CardModule, ButtonModule, TitleCasePipe],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  constructor() {}

  ngOnInit() {}

  addProductToCart() {
    this.addToCart.emit(this.product);
  }
  onImageError(event: Event) {
    this.product.img = 'assets/No-Image-Placeholder.svg';
  }
}
