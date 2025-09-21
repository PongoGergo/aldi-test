import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CartComponent } from './cart.component';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../../interfaces/cart.i';
import { Product } from '../../interfaces/product.i';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { InputNumber } from 'primeng/inputnumber';

// Mock the ProductService to control its behavior during tests.
class MockProductService {
  formatPrice(price: number): string {
    return `${price} HUF`;
  }
}

// Mock the CartService to control the state of the cart.
class MockCartService {
  cart: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  removeFromCart = jasmine.createSpy('removeFromCart');
  updateCartItem = jasmine.createSpy('updateCartItem');
  clearCart = jasmine.createSpy('clearCart');
}

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: MockCartService;
  let productService: MockProductService;

  const mockCartItems: CartItem[] = [
    {
      id: 1,
      name: 'Product A',
      img: 'a.jpg',
      availableAmount: 10,
      minOrderAmount: 1,
      price: 100,
      amount: 2,
    },
    {
      id: 2,
      name: 'Product B',
      img: 'b.jpg',
      availableAmount: 20,
      minOrderAmount: 2,
      price: 50,
      amount: 3,
    },
  ];

  beforeEach(async () => {
    // Configure the testing module with mock providers.
    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: CartService, useClass: MockCartService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService) as unknown as MockCartService;
    productService = TestBed.inject(
      ProductService
    ) as unknown as MockProductService;

    // Set up initial cart data
    cartService.cart.next(mockCartItems);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart items and calculate totals on ngOnInit', () => {
    expect(component.cart).toEqual(mockCartItems);
    expect(component.totalItems).toBe(5);
    expect(component.totalPrice).toBe('500 HUF');
  });

  it('should call removeFromCart and recalculate totals when an item is removed', () => {
    spyOn(component, 'calculateTotals');
    const removeButton = fixture.debugElement.query(
      By.css('button.p-button-rounded.p-button-danger')
    );
    removeButton.triggerEventHandler('click');

    expect(cartService.removeFromCart).toHaveBeenCalledWith(
      mockCartItems[0].id
    );
    expect(component.calculateTotals).toHaveBeenCalled();
  });

  it('should call updateCartItem and recalculate totals when an item is updated', () => {
    spyOn(component, 'calculateTotals');
    const updatedItem = { ...mockCartItems[0], amount: 5 };

    component.updateCartItem(updatedItem);

    expect(cartService.updateCartItem).toHaveBeenCalledWith(updatedItem);
    expect(component.calculateTotals).toHaveBeenCalled();
  });

  it('should call clearCart when the clear cart button is clicked', () => {
    const clearButton = fixture.debugElement.query(
      By.css('button.p-button-danger.mb-3')
    );
    clearButton.triggerEventHandler('click');
    expect(cartService.clearCart).toHaveBeenCalled();
  });

  it('should update image source on image error', () => {
    const imgElement = fixture.debugElement.query(
      By.css('.cart-img')
    ).nativeElement;
    imgElement.src = 'invalid-image-path.jpg';
    imgElement.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(imgElement.src).toContain('assets/No-Image-Placeholder.svg');
  });

  it('should unsubscribe from cartSubscription on ngOnDestroy', () => {
    expect(component.cartSubscription.closed).toBeFalse();
    component.ngOnDestroy();
    expect(component.cartSubscription.closed).toBeTrue();
  });
});
