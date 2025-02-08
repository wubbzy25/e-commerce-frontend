import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ProductsService } from '../Services/ProductsService';
import { CardComponent } from '../card/card.component';
import { NgFor } from '@angular/common';
import { ReviewsService } from '../Services/ReviewsService';
import { ReviewsCardComponent } from '../reviews-card/reviews-card.component';

@Component({
  selector: 'app-home',
  imports: [
    NavbarComponent,
    CardComponent,
    NgFor,
    FooterComponent,
    ReviewsCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  topSelling: any[] = [];
  newArrivals: any[] = [];
  reviews: any[] = [];

  constructor(
    private productService: ProductsService,
    private reviewsService: ReviewsService
  ) {}

  ngOnInit(): void {
    this.productService.getNewArrivals().subscribe((response) => {
      this.newArrivals = response;
    });
    this.productService.getTopSelling().subscribe((response) => {
      this.topSelling = response;
    });

    this.reviewsService.getReviews().subscribe((response) => {
      this.reviews = response;
    });
  }
}
