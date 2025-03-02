import { Review } from './Review';
import { Pageable } from './Pageable';
import { Sort } from './Sort';
export interface ReviewById {
  content: Review[];
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
