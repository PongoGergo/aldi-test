import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Product } from '../interfaces/product.i';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProductsWithDuplicates: Product[] = [
    {
      id: 1,
      name: 'product A',
      img: 'a.jpg',
      availableAmount: 10,
      minOrderAmount: 1,
      price: 100,
    },
    {
      id: 2,
      name: 'product B',
      img: 'b.jpg',
      availableAmount: 20,
      minOrderAmount: 2,
      price: 200,
    },
    {
      id: 1,
      name: 'product A',
      img: 'a.jpg',
      availableAmount: 10,
      minOrderAmount: 1,
      price: 100,
    },
  ];

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'product A',
      img: 'a.jpg',
      availableAmount: 10,
      minOrderAmount: 1,
      price: 100,
    },
    {
      id: 2,
      name: 'product B',
      img: 'b.jpg',
      availableAmount: 20,
      minOrderAmount: 2,
      price: 200,
    },
    {
      id: 3,
      name: 'product C',
      img: 'c.jpg',
      availableAmount: 30,
      minOrderAmount: 3,
      price: 300,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);

    const req = httpMock.expectOne(
      'https://cas5-0-urlprotect.trendmicro.com:443/wis/clicktime/v1/query?url=https%3a%2f%2f63c10327716562671870f959.mockapi.io%2fproducts&umid=edab3d48-7a50-4ca6-b6c9-9362af456f60&auth=3bd1ed0ea25e030aebac2180cda48b2d7a1ccc30-bf53e959aa381ef3b79ace2237ee4d9545bb0e5b'
    );
    req.flush(mockProducts);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load products and update behavior subjects', () => {
    expect(service.products.getValue().length).toBe(mockProducts.length);
    expect(service.filteredProducts.getValue().length).toBe(
      mockProducts.length
    );
  });

  it('should check if IDs are unique', () => {
    // Create a new copy to avoid mutation from other tests
    const productsWithDuplicates = [...mockProductsWithDuplicates];
    expect(service.checkIfIdAreUnique(mockProducts)).toBeTrue();
    expect(service.checkIfIdAreUnique(productsWithDuplicates)).toBeFalse();
  });

  it('should change non-unique IDs to unique IDs', () => {
    const productsWithChangedIds = service.changeIdToUnique(
      mockProductsWithDuplicates
    );
    const ids = productsWithChangedIds.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toEqual(uniqueIds.size);
  });

  it('should filter products based on searchTerm', () => {
    service.filterProducts('product A');
    expect(service.filteredProducts.getValue().length).toBe(1);
    expect(service.filteredProducts.getValue()[0].name).toBe('product A');
  });

  it('should reset products when filterProducts is called with empty searchTerm', () => {
    service.filterProducts('');
    expect(service.filteredProducts.getValue().length).toBe(
      mockProducts.length
    );
  });

  it('should format price correctly with Ft currency symbol', () => {
    const formattedPrice = service.formatPrice(12345);
    expect(formattedPrice).toBe('12\u00A0345\u00A0Ft');
  });
});
