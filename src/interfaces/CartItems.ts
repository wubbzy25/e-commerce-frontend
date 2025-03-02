import { Cart } from './Cart';

export interface CartItems {
  id_cart_item: number;
  quantity: number;
  size: string;
  cart: Cart;
  product: CartProduct;
}

interface CartProduct {
  id_product: number;
  name: string;
  price: number;
  color: string;
  image: string;
  stock: number;
  discount: number;
}
