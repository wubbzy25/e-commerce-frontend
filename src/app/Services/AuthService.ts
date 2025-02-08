import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/api/v1/auth';
  private localStorage: Storage | undefined;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.localStorage = this.document.defaultView?.localStorage;
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        this.setToken(response.token);
        this.setUserId(response.id_user);
      })
    );
  }

  register(user: {
    first_name: String;
    last_name: String;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user).pipe(
      tap((response: any) => {
        this.setToken(response.token);
        this.setUserId(response.id_user);
      })
    );
  }

  private setToken(token: string): void {
    this.localStorage?.setItem('auth_token', token);
  }

  private setUserId(userId: string): void {
    this.localStorage?.setItem('id_user', userId);
  }

  getToken(): string | null {
    if (this.localStorage) {
      return this.localStorage.getItem('auth_token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    let token = this.getToken();
    return token !== null;
  }

  logout(): void {
    if (this.localStorage) {
      this.localStorage.removeItem('auth_token');
    }
  }
}
