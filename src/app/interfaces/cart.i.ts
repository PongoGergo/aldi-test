import { Product } from './product.i';

export interface CartItem extends Product {
  amount: number;
}
