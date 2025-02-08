import { Component, Input, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  imports: [NgIf, NgFor],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css'],
})
export class StarRatingComponent implements OnInit {
  @Input() rating: number = 3.5;
  stars: string[] = [];

  ngOnInit(): void {
    this.stars = this.getStars(this.rating);
  }

  getStars(rating: number): string[] {
    const starsArray: string[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        starsArray.push('full');
      } else if (rating >= i - 0.5) {
        starsArray.push('half');
      } else {
        starsArray.push('empty');
      }
    }
    return starsArray;
  }
}
