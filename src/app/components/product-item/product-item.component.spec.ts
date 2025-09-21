import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductItemComponent } from './product-item.component';
import { Product } from '../../interfaces/product.i';
import { By } from '@angular/platform-browser';

describe('ProductItemComponent', () => {
  let component: ProductItemComponent;
  let fixture: ComponentFixture<ProductItemComponent>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    img: 'test-image.jpg',
    availableAmount: 100,
    minOrderAmount: 5,
    price: 500,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the product name, price, and available amount', () => {
    const cardElement = fixture.debugElement.query(
      By.css('p-card')
    ).nativeElement;

    // Check if the card contains the correct product name
    expect(cardElement.textContent).toContain('Test Product');

    // Check if the card contains the calculated price and minOrderAmount
    const expectedPriceText = `${
      mockProduct.price * mockProduct.minOrderAmount
    } Ft`;
    expect(cardElement.textContent).toContain(expectedPriceText);

    // Check if the card contains the available amount
    const expectedAmountText = `Raktáron: ${mockProduct.availableAmount} Darab`;
    expect(cardElement.textContent).toContain(expectedAmountText);
  });

  it('should emit addToCart event when button is clicked', () => {
    spyOn(component.addToCart, 'emit');
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    expect(component.addToCart.emit).toHaveBeenCalledWith(mockProduct);
  });

  it('should change image to placeholder on image error', () => {
    const imgElement = fixture.debugElement.query(By.css('img')).nativeElement;
    imgElement.src = 'invalid-image-path.jpg';
    imgElement.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(imgElement.src).toContain('assets/No-Image-Placeholder.svg');
  });
});
