import { isPlatformBrowser } from '@angular/common';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, throwError } from 'rxjs';
import { Review } from '../../interfaces/Review';
import { ReviewById } from '../../interfaces/ReviewById';
@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private baseUrl = 'http://localhost:8000/api/v1/reviews/';
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Fetches a list of random reviews from the API.
   * @returns An Observable of an array of Review objects.
   */
  getReviews(): Observable<Review[]> {
    return this.ifBrowser(() =>
      // GET request to fetch random review
      this.http
        .get<Review[]>(`${this.baseUrl}/getRandomReviews`)
        // Handle any errors that occur.
        .pipe(catchError((error) => this.handleError(error)))
    );
  }

  /**
   * Fetches reviews for a specific product by its ID, with pagination and sorting options.
   * @param productId The ID of the product.
   * @param page The page number for pagination.
   * @param PageSize The number of reviews per page.
   * @param sort The sorting criteria (e.g., "date", "rating").
   * @returns An Observable of ReviewById (paginated reviews).
   */
  getReviewsByIdProduct(
    productId: number,
    page: number,
    PageSize: number,
    sort: string
  ): Observable<ReviewById> {
    // Set up query parameters for the request.
    const params = new HttpParams()
      .set('productId', productId)
      .set('page', page)
      .set('pageSize', PageSize)
      .set('sort', sort);
    return this.ifBrowser(() =>
      // GET request to fetch reviews by product ID with query parameters.
      this.http
        .get<ReviewById>(`${this.baseUrl}/getReviewsByIdProduct`, { params })
        .pipe(catchError((error) => this.handleError(error)))
    );
  }

  /**
   * Handles HTTP errors and displays an error message using ToastrService.
   * @param error The error object returned by the HTTP request.
   * @returns An Observable that throws the error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    // Display an error toast notification with the error message.
    this.toastr.error(error.error.error, 'Error Reviews Service:');
    // Throw the error to be handled by the subscriber.
    return throwError(() => error);
  }
  /**
   * Ensures that the provided callback function runs only in a browser environment.
   * @param callback A function that returns an Observable.
   * @returns An Observable of type T or throws an error if not in a browser environment.
   */
  private ifBrowser<T>(callback: () => Observable<T>): Observable<T> {
    if (isPlatformBrowser(this.platformId)) {
      // Execute the callback if running in a browser.
      return callback();
    } else {
      // Throw an error if not running in a browser.
      return throwError(() => 'is not platform web');
    }
  }
}
