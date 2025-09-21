import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../interfaces/product.i';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  filteredProducts: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(
    []
  );
  constructor(readonly http: HttpClient) {
    this.loadProducts();
  }

  loadProducts() {
    this.getProducts().subscribe((products) => {
      if (this.checkIfIdAreUnique(products) === false) {
        this.changeIdToUnique(products);
      }
      const clonedProducts = products.map((p) => ({ ...p }));
      this.products.next(clonedProducts);
      this.filteredProducts.next(products);
    });
  }
  checkIfIdAreUnique(products: Product[]) {
    const ids = products.map((p) => p.id);
    const uniqueIds = new Set(ids);
    return ids.length === uniqueIds.size;
  }
  changeIdToUnique(products: Product[]) {
    const ids = products.map((p) => p.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      let maxId = Math.max(...ids);
      products.forEach((product) => {
        if (ids.indexOf(product.id) !== ids.lastIndexOf(product.id)) {
          maxId += 1;
          product.id = maxId;
        }
      });
    }
    return products;
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      'https://cas5-0-urlprotect.trendmicro.com:443/wis/clicktime/v1/query?url=https%3a%2f%2f63c10327716562671870f959.mockapi.io%2fproducts&umid=edab3d48-7a50-4ca6-b6c9-9362af456f60&auth=3bd1ed0ea25e030aebac2180cda48b2d7a1ccc30-bf53e959aa381ef3b79ace2237ee4d9545bb0e5b'
    );
  }

  filterProducts(searchTerm: string) {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const filtered = this.products
      .getValue()
      .filter((product) => product.name.toLowerCase().includes(lowerCaseTerm));
    this.filteredProducts.next(filtered);
  }

  resetProducts() {
    this.filteredProducts.next(this.products.getValue());
  }

  formatPrice(price: number): string {
    return price.toLocaleString('hu-HU', {
      style: 'currency',
      currency: 'HUF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
}
