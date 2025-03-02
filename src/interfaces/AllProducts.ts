import { Product } from './Product';
import { Pageable } from './Pageable';
import { Sort } from './Sort';
export interface AllProducts {
  content: Product[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
