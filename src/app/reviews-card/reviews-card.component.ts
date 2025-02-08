import { Component, Input } from '@angular/core';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-reviews-card',
  imports: [StarRatingComponent],
  templateUrl: './reviews-card.component.html',
  styleUrl: './reviews-card.component.css',
})
export class ReviewsCardComponent {
  @Input() rating: number = 0;
  @Input() name: string = '';
  @Input() review: string = '';
}
