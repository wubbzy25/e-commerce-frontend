import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../../interfaces/Cart';
import { Response } from 'express';
import { CartItems } from '../../interfaces/CartItems';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl: string = 'http://localhost:8000/api/v1/shopping-cart';
  private localStorage: Storage | undefined;
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: ToastrService,
    @Inject(DOCUMENT) private document: Document
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.localStorage = this.document.defaultView?.localStorage;
    }
  }

  /**
   * Retrieves the user ID from localStorage.
   * @returns The user ID as a string or null if not found.
   */
  getUserId(): string | null {
    return this.localStorage ? this.localStorage.getItem('id_user') : null;
  }
  /**
   * Retrieves the cart  for the current user.
   * @returns An Observable containing the cart details.
   */

  GetCart(): Observable<Cart> {
    let params = new HttpParams();
    const id_user = this.getUserId();
    // Add the user ID to the parameters if it exists.
    if (id_user) {
      params = params.set('id_user', id_user);
    }
    return this.ifBrowser(() =>
      this.http.get<Cart>(`${this.baseUrl}/GetCart`, { params }).pipe(
        tap((response: any) => {
          // Extract the cart ID from the response.
          const id_cart = response.id_cart;
          // Save the cart ID to localStorage if available.
          if (id_cart && this.localStorage) {
            this.localStorage.setItem('id_cart', id_cart);
          }
        }),
        // Handle any errors that occur.
        catchError((error) => this.handleError(error))
      )
    );
  }

  /**
   * Creates a new cart for the current user.
   * @returns An Observable containing the response from the API.
   */
  CreateCart(): Observable<Response> {
    // Initialize the request body.
    let body: { id_user?: string } = {};
    // Get the current user's ID.
    const id_user = this.getUserId();
    // Add the user ID to the request body if it exists.
    if (id_user) {
      body = {
        id_user: id_user,
      };
    }
    return this.ifBrowser(() =>
      // POST request to create a new cart
      this.http
        .post<Response>(`${this.baseUrl}/CreateCart`, body)
        // Handle any errors that occur.
        .pipe(catchError((error) => this.handleError(error)))
    );
  }

  /**
   * Retrieves the items in a specific cart.
   * @param id_cart The ID of the cart.
   * @returns An Observable containing the cart items.
   */
  GetCartItems(id_cart: number): Observable<CartItems[]> {
    const params = new HttpParams().set('id_cart', id_cart);

    return this.ifBrowser(() =>
      // GET request to fetch cart items.
      this.http
        .get<CartItems[]>(`${this.baseUrl}/GetItems`, { params })
        // Handle any errors that occur.
        .pipe(catchError((error) => this.handleError(error)))
    );
  }

  /**
   * Adds an item to the cart.
   * @param quantity The quantity of the item.
   * @param id_product The ID of the product.
   * @param id_cart The ID of the cart.
   * @param size The size of the product.
   * @returns An Observable containing the response from the API.
   */
  AddItemToCart(
    quantity: number,
    id_product: number,
    id_cart: number,
    size: string
  ): Observable<Response> {
    const body = {
      quantity: quantity,
      id_product: id_product,
      id_cart: id_cart,
      size: size,
    };

    return this.ifBrowser(() =>
      // POST request to add an item to the cart.
      this.http
        .post<Response>(`${this.baseUrl}/AddItem`, body)
        // Handle any errors that occur.
        .pipe(catchError((error) => this.handleError(error)))
    );
  }

  /**
   * Updates the quantity of an item in the cart.
   * @param new_quantity The new quantity of the item.
   * @param id_item The ID of the item.
   * @returns An Observable containing the response from the API.
   */
  UpdateQuantity(new_quantity: number, id_item: number): Observable<Response> {
    const body = {
      new_quantity: new_quantity,
      id_item: id_item,
    };

    return this.ifBrowser(() =>
      // PUT request to update the item quantity.
      this.http
        .put<Response>(`${this.baseUrl}/UpdateQuantity`, body)
        // Handle any errors that occur.
        .pipe(catchError((error) => this.handleError(error)))
    );
  }

  /**
   * Deletes an item from the cart.
   * @param id_item The ID of the item to delete.
   * @returns An Observable containing the response from the API.
   */

  DeleteItem(id_item: number): Observable<Response> {
    const params = new HttpParams().set('id_item', id_item.toString());
    return this.ifBrowser(() =>
      // DELETE request to remove an item from the cart.
      this.http
        .delete<Response>(`${this.baseUrl}/DeleteItem`, { params })
        // Handle any errors that occur.
        .pipe(catchError((error) => this.handleError(error)))
    );
  }

  /**
   * Deletes all items from the cart.
   * @returns An Observable containing the response from the API.
   */
  DeleteAllItems(): Observable<Response> {
    // Get the cart ID from localStorage.
    const id_cart = this.localStorage
      ? this.localStorage.getItem('id_cart')
      : null;
    let params = new HttpParams();
    // Add the cart ID to the parameters if it exists.
    if (id_cart) {
      params = params.set('id_cart', id_cart);
    }

    return this.ifBrowser(() =>
      // DELETE request to remove all items from the cart.
      this.http
        .delete<Response>(`${this.baseUrl}/DeleteAllItems`, { params })
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
    let message = 'an error ocurred while processing the request';

    if (error.error.message.includes('llave duplicada')) {
      // Handle duplicate key error specifically.
      message = 'The item is already in your cart.';
    }

    this.toastr.error(message, 'Error');
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
