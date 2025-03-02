import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Observable, throwError, catchError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { SuccessSesion } from '../../interfaces/SucessSession';
import { Checkout } from '../../interfaces/Checkout';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'http://localhost:8000/api/v1/payments';
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Initiates a checkout process for a user.
   * @param id_user The ID of the user.
   * @param total The total amount to be paid.
   * @returns An Observable of a Checkout object.
   */
  checkout(id_user: number, total: number): Observable<Checkout> {
    const body = {
      id_user: id_user,
      amount: total,
    };
    return this.ifBrowser(() =>
      // POST request to initiate checkout.
      this.http
        .post<Checkout>(`${this.baseUrl}/checkout`, body)
        // Handle any errors that occur.
        .pipe(catchError((error) => this.handleError(error)))
    );
  }

  /**
   * Retrieves the details of a successful payment session.
   * @param SessionId The ID of the payment session.
   * @returns An Observable of a SuccessSesion object.
   */
  getSuccessSession(SessionId: string): Observable<SuccessSesion> {
    // Set query parameter for session ID.
    const params = new HttpParams().set('session_id', SessionId);

    return this.ifBrowser(() =>
      // GET request to fetch session details.
      this.http
        .get<SuccessSesion>(`${this.baseUrl}/success-session`, {
          params,
        })
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
    this.toastr.error(error.error.error, 'Error Payment Service:');
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
