import { User } from './User';

export interface Review {
  id_review: number;
  score: number;
  review: string;
  posted_date: string;
  name: string;
  user: User;
}
