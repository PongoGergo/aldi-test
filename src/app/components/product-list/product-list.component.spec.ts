import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../interfaces/product.i';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

// Mock the ProductItemComponent to avoid testing its internal logic
@Component({
  selector: 'app-product-item',
  template: '',
  standalone: true, // Mark mock component as standalone
})
class MockProductItemComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
}

// Mock the ProductService to control its behavior during tests
class MockProductService {
  filteredProducts = new BehaviorSubject<Product[]>([]);
}

// Mock the CartService to control the state of the cart
class MockCartService {
  addToCartIfHasAvailableAmount = jasmine.createSpy(
    'addToCartIfHasAvailableAmount'
  );
}

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: MockProductService;
  let cartService: MockCartService;

  // Mock data for testing
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Product A',
      img: 'a.jpg',
      availableAmount: 10,
      minOrderAmount: 1,
      price: 100,
    },
    {
      id: 2,
      name: 'Product B',
      img: 'b.jpg',
      availableAmount: 20,
      minOrderAmount: 2,
      price: 200,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: CartService, useClass: MockCartService },
      ],
    })
      .overrideComponent(ProductListComponent, {
        set: { imports: [MockProductItemComponent, CommonModule] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(
      ProductService
    ) as unknown as MockProductService;
    cartService = TestBed.inject(CartService) as unknown as MockCartService;

    // Initially provide mock products to the filteredProducts stream
    productService.filteredProducts.next(mockProducts);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate products from filteredProducts observable on ngOnInit', () => {
    expect(component.products).toEqual(mockProducts);
  });

  it('should call cartService.addToCartIfHasAvailableAmount when addToCart is called', () => {
    const productToAdd = mockProducts[0];
    component.addToCart(productToAdd);
    expect(cartService.addToCartIfHasAvailableAmount).toHaveBeenCalledWith(
      productToAdd
    );
  });

  it('should unsubscribe from productsSubscription on ngOnDestroy to prevent memory leaks', () => {
    // Check if there is an active subscription
    expect(component.productsSubscription.closed).toBeFalse();

    // Call ngOnDestroy
    component.ngOnDestroy();

    // The subscription should now be closed
    expect(component.productsSubscription.closed).toBeTrue();
  });

  it('should render the correct number of product items', () => {
    fixture.detectChanges(); // Ensure the latest changes are reflected in the view
    const productItems = fixture.debugElement.queryAll(
      By.directive(MockProductItemComponent)
    );
    expect(productItems.length).toBe(mockProducts.length);
  });
});
