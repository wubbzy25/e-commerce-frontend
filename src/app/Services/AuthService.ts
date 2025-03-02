import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { Auth } from '../../interfaces/Auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Base URL for the authentication API.
  private baseUrl = 'http://localhost:8000/api/v1/auth';
  private localStorage: Storage | undefined;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize localStorage if running in a browser.
      this.localStorage = this.document.defaultView?.localStorage;
    }
  }

  /**
   * Logs in a user with the provided credentials.
   * @param credentials The user's email and password.
   * @returns An Observable of type Auth.
   */
  login(credentials: { email: string; password: string }): Observable<Auth> {
    return this.ifBrowser(() =>
      this.http.post(`${this.baseUrl}/login`, credentials).pipe(
        // Store the token and user ID on successful login.
        tap((response: any) => {
          this.setToken(response.token);
          this.setUserId(response.id_user);
        }),
        // Handle any errors that occur during the HTTP request.
        catchError((error) => this.handleError(error))
      )
    );
  }

  /**
   * Registers a new user with the provided information.
   * @param user The user's registration details.
   * @returns An Observable of type Auth.
   */
  register(user: {
    first_name: String;
    last_name: String;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Observable<Auth> {
    return this.ifBrowser(() =>
      this.http.post(`${this.baseUrl}/register`, user).pipe(
        // Store the token and user ID on successful registration.
        tap((response: any) => {
          this.setToken(response.token);
          this.setUserId(response.id_user);
        })
      )
    );
  }

  /**
   * Stores the authentication token in localStorage.
   * @param token The authentication token.
   */
  private setToken(token: string): void {
    this.localStorage?.setItem('auth_token', token);
  }

  /**
   * Stores the user ID in localStorage.
   * @param userId The user ID.
   */
  private setUserId(userId: string): void {
    this.localStorage?.setItem('id_user', userId);
  }

  /**
   * Retrieves the authentication token from localStorage.
   * @returns The authentication token or null if not found.
   */
  getToken(): string | null {
    if (this.localStorage) {
      return this.localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Checks if the user is authenticated by verifying the presence of a token.
   * @returns True if the user is authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    let token = this.getToken();
    return token !== null;
  }

  /**
   * Checks if the authentication token is expired.
   * @param token The authentication token.
   * @returns True if the token is expired, false otherwise.
   */
  isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const exp = decodedToken.exp;
      const currentTime = Math.floor(Date.now() / 1000);

      return exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Logs out the user by removing the authentication token from localStorage.
   */
  logout(): void {
    if (this.localStorage) {
      this.localStorage.removeItem('auth_token');
    }
  }

  /**
   * Handles HTTP errors and displays an error message using ToastrService.
   * @param error The error object returned by the HTTP request.
   * @returns An Observable that throws the error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    // Display an error toast notification with the error message.
    this.toastr.error(error.error.error, 'Error with Auth Services:');
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
