import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../../interfaces/Product';
import { AllProducts } from '../../interfaces/AllProducts';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseUrl: string = 'http://localhost:8000/api/v1/catalog/products';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Fetches the top-selling products from the API.
   * @returns An Observable of a Product object.
   */
  getTopSelling(): Observable<Product[]> {
    return this.ifBrowser(() =>
      // GET request to fetch top-selling product
      this.http
        .get<Product[]>(`${this.baseUrl}/topSelling`)
        // Handle any errors that occur.
        .pipe(catchError((error) => this.handleError(error)))
    );
  }
  /**
   * Fetches the new arrival products from the API.
   * @returns An Observable of a Product object.
   */
  getNewArrivals(): Observable<Product[]> {
    return this.ifBrowser(() =>
      // GET request to fetch new arrival product
      this.http
        .get<Product[]>(`${this.baseUrl}/newArrivals`)
        // Handle any errors that occur.
        .pipe(catchError((error) => this.handleError(error)))
    );
  }
  /**
   * Fetches a product by its ID from the API.
   * @param productId The ID of the product.
   * @returns An Observable of a Product object.
   */
  getProductById(productId: number): Observable<Product> {
    // Set query parameter for product ID.
    const params = new HttpParams().set('productId', productId);
    return this.ifBrowser(() =>
      // GET request to fetch product by ID.

      this.http
        .get<Product>(`${this.baseUrl}/GetProductById`, { params })
        // Handle any errors that occur.
        .pipe(catchError((error) => this.handleError(error)))
    );
  }

  /**
   * Fetches similar products from the API.
   * @returns An Observable of a Product object.
   */

  getSimilarProducts(): Observable<Product[]> {
    return this.ifBrowser(() =>
      // GET request to fetch similar products.
      this.http
        .get<Product[]>(`${this.baseUrl}/GetSimilarProducts`)
        // Handle any errors that occur.
        .pipe(catchError((error) => this.handleError(error)))
    );
  }

  /**
   * Fetches all products with optional filters, pagination, and sorting.
   * @param minPrice The minimum price filter.
   * @param maxPrice The maximum price filter.
   * @param colors An array of colors to filter by.
   * @param sizes An array of sizes to filter by.
   * @param dressStyles An array of dress styles to filter by.
   * @param page The page number for pagination.
   * @param size The number of products per page.
   * @param sort The sorting criteria (e.g., "price", "rating").
   * @returns An Observable of an AllProducts object.
   */
  getAllProducts(
    minPrice: number,
    maxPrice: number,
    colors: string[],
    sizes: string[],
    dressStyles: string[],
    page: number,
    size: number,
    sort: string
  ): Observable<AllProducts> {
    let params = new HttpParams();

    // Add optional filters to the query parameters.
    if (minPrice !== 0) {
      params = params.set('minPrice', minPrice.toString());
    }
    if (maxPrice !== 0) {
      params = params.set('maxPrice', maxPrice.toString());
    }
    if (colors && colors.length > 0) {
      // Convert colors to uppercase.
      const upperColors = colors.map((color) => color.toUpperCase());
      params = params.set('colors', upperColors.join(','));
    }
    if (sizes && sizes.length > 0) {
      // Join sizes into a comma-separated string.
      params = params.set('sizes', sizes.join(','));
    }
    if (dressStyles && dressStyles.length > 0) {
      const LowerDress = dressStyles.map((dressStyles) =>
        // Convert dress styles to lowercase.
        dressStyles.toLowerCase()
      );
      // Join dress styles into a comma-separated string.
      params = params.set('dressStyle', LowerDress.join(','));
    }
    // Add pagination and sorting parameters.
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());
    params = params.set('sort', sort);
    return this.ifBrowser(() =>
      // GET request to fetch all products with filters.
      this.http
        .get<AllProducts>(`${this.baseUrl}/GetAllProducts`, { params })
        // Handle any errors that occur.
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
    this.toastr.error(error.error.error, 'Error Products Service:');
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
