import { Size } from './Size';

export interface Product {
  id_product: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  color: string;
  created_at: string;
  discount: number;
  averageScore: number;
  sizes: Size[];
}
