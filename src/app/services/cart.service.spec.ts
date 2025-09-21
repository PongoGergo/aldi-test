import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../interfaces/product.i';
import { CartItem } from '../interfaces/cart.i';

describe('CartService', () => {
  let service: CartService;

  // Mock data for testing
  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    img: 'test.jpg',
    availableAmount: 10,
    minOrderAmount: 2,
    price: 100,
  };

  const mockCartItem: CartItem = {
    ...mockProduct,
    amount: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService],
    });
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new product to an empty cart', () => {
    service.addToCartIfHasAvailableAmount(mockProduct);
    const cart = service.cart.getValue();
    expect(cart.length).toBe(1);
    expect(cart[0].id).toBe(mockProduct.id);
    expect(cart[0].amount).toBe(1);
  });

  it('should increment the amount of an existing product in the cart', () => {
    service.cart.next([{ ...mockCartItem }]);
    service.addToCartIfHasAvailableAmount(mockProduct);
    const cart = service.cart.getValue();
    expect(cart.length).toBe(1);
    expect(cart[0].amount).toBe(2);
  });

  it('should not add a product if it exceeds available amount', () => {
    const limitedProduct = {
      ...mockProduct,
      availableAmount: 5,
      minOrderAmount: 5,
    };
    const limitedCartItem = { ...limitedProduct, amount: 1 };
    service.cart.next([limitedCartItem]);
    service.addToCartIfHasAvailableAmount(limitedProduct);
    const cart = service.cart.getValue();
    expect(cart[0].amount).toBe(1);
  });

  it('should remove a product from the cart', () => {
    service.cart.next([{ ...mockCartItem }]);
    service.removeFromCart(mockProduct.id);
    const cart = service.cart.getValue();
    expect(cart.length).toBe(0);
  });

  it('should decrement the amount of a product in the cart', () => {
    const multiItem = { ...mockCartItem, amount: 2 };
    service.cart.next([multiItem]);
    service.removeOneFromCart(mockProduct.id);
    const cart = service.cart.getValue();
    expect(cart.length).toBe(1);
    expect(cart[0].amount).toBe(1);
  });

  it('should remove the product from the cart when amount drops to 1', () => {
    const singleItem = { ...mockCartItem };
    service.cart.next([singleItem]);
    service.removeOneFromCart(mockProduct.id);
    const cart = service.cart.getValue();
    expect(cart.length).toBe(0);
  });

  it('should update a cart item', () => {
    service.cart.next([{ ...mockCartItem }]);
    const updatedItem = { ...mockCartItem, amount: 5, price: 200 };
    service.updateCartItem(updatedItem);
    const cart = service.cart.getValue();
    expect(cart.length).toBe(1);
    expect(cart[0].amount).toBe(5);
    expect(cart[0].price).toBe(200);
  });

  it('should clear the cart', () => {
    service.cart.next([{ ...mockCartItem }]);
    service.clearCart();
    const cart = service.cart.getValue();
    expect(cart.length).toBe(0);
  });
});
