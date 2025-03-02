import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ProductsService } from '../Services/ProductsService';
import { CardComponent } from '../card/card.component';
import { NgFor } from '@angular/common';
import { ReviewsService } from '../Services/ReviewsService';
import { ReviewsCardComponent } from '../reviews-card/reviews-card.component';
import { Product } from '../../interfaces/Product';
import { Review } from '../../interfaces/Review';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  topSelling: Product[] = []; // Array to store top selling products
  newArrivals: Product[] = []; // Array to store new arrival products
  reviews: Review[] = []; // Array to store product reviews

  constructor(
    private productService: ProductsService,
    private toastr: ToastrService,
    private reviewsService: ReviewsService
  ) {}

  /**
   * Method that runs on component initialization.
   * Loads new arrival products, top selling products, and product reviews.
   */
  ngOnInit(): void {
    this.loadNewArrivals();
    this.loadTopSelling();
    this.loadReviews();
  }

  /**
   * Loads new arrival products.
   * Makes a request to the product service and assigns the response to `newArrivals`.
   */
  private loadNewArrivals(): void {
    this.productService.getNewArrivals().subscribe((response) => {
      this.newArrivals = response;
    });
  }

  /**
   * Loads top selling products.
   * Makes a request to the product service and assigns the response to `topSelling`.
   */
  private loadTopSelling(): void {
    this.productService.getTopSelling().subscribe((response) => {
      this.topSelling = response;
    });
  }

  /**
   * Loads product reviews.
   * Makes a request to the reviews service and assigns the response to `reviews`.
   */
  private loadReviews(): void {
    this.reviewsService.getReviews().subscribe((response) => {
      this.reviews = response;
    });
  }
}
