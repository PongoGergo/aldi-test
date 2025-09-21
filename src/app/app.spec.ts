import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { App } from './app';
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';
import { BehaviorSubject, of } from 'rxjs';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Product } from './interfaces/product.i';
import { CartItem } from './interfaces/cart.i';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from './app.routes';

// --- MOCK SERVICES FOR ISOLATED TESTING ---

// Mock the ProductService to control its behavior during tests.
class MockProductService {
  products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  filteredProducts = new BehaviorSubject([]);
  formatPrice(price: number): string {
    return `${price} HUF`;
  }
  // Use a spy to track if these methods are called.
  filterProducts = jasmine.createSpy('filterProducts');
  resetProducts = jasmine.createSpy('resetProducts');
}

// Mock the CartService to control the state of the cart.
class MockCartService {
  cart: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
}

const mockCart = [
  {
    id: 1,
    name: 'test product',
    img: 'test.jpg',
    availableAmount: 100,
    minOrderAmount: 10,
    price: 10,
    amount: 2,
  },
  {
    id: 2,
    name: 'test product 2',
    img: 'test.jpg',
    availableAmount: 100,
    minOrderAmount: 10,
    price: 100,
    amount: 3,
  },
];
@Component({ template: '' })
class MockProductListComponent {}

@Component({ template: '' })
class MockCartComponent {}

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let productService: MockProductService;
  let cartService: MockCartService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        RouterTestingModule.withRoutes(routes),
        MockCartComponent,
        MockProductListComponent,
      ],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: CartService, useClass: MockCartService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    productService = TestBed.inject(
      ProductService
    ) as unknown as MockProductService;
    cartService = TestBed.inject(CartService) as unknown as MockCartService;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize cart totals on ngOnInit', () => {
    cartService.cart.next(mockCart);
    fixture.detectChanges();

    expect(component.cartTotalItems).toBe(5);
    expect(component.cartTotalPrice).toBe('3200 HUF');
  });

  it('should set path to "products" for the root URL', fakeAsync(() => {
    router.navigateByUrl('/');
    tick(); // Wait for the async router events to complete
    fixture.detectChanges();
    expect(component.path).toBe('products');
  }));

  it('should set the path based on router events', fakeAsync(() => {
    router.navigateByUrl('/cart');
    tick(); // Wait for the async router events to complete
    fixture.detectChanges();
    expect(component.path).toBe('cart');
  }));

  it('should call productService.resetProducts if searchTerm is empty or whitespace', () => {
    component.searchTerm = '   ';
    component.filterProducts();
    expect(productService.resetProducts).toHaveBeenCalled();
    expect(productService.filterProducts).not.toHaveBeenCalled();
  });

  it('should call productService.filterProducts with the searchTerm if not empty', () => {
    component.searchTerm = 'milk';
    component.filterProducts();
    expect(productService.filterProducts).toHaveBeenCalledWith('milk');
    expect(productService.resetProducts).not.toHaveBeenCalled();
  });

  it('should correctly calculate cart total items with various quantities', () => {
    cartService.cart.next(mockCart);
    fixture.detectChanges();
    expect(component.cartTotalItems).toBe(5);
  });

  it('should correctly calculate cart total price with various items', () => {
    cartService.cart.next(mockCart);
    fixture.detectChanges();
    expect(component.cartTotalPrice).toBe('3200 HUF');
  });

  it('should handle an empty cart for total items and price', () => {
    cartService.cart.next([]);
    fixture.detectChanges();
    expect(component.cartTotalItems).toBe(0);
    expect(component.cartTotalPrice).toBe('0 HUF');
  });
});
