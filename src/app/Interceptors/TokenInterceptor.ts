import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/AuthService';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const TokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  const excludedPaths = ['/login', '/register']; // Paths that do not require token

  const isExcluded = excludedPaths.some((path) => req.url.includes(path)); // Check if the request URL is excluded

  if (token && !isExcluded) {
    const isTokenExpired = authService.isTokenExpired(token);
    if (isTokenExpired) {
      authService.logout(); // Logout if the token is expired
      router.navigate(['/login']); // Redirect to login page
      return throwError(() => new Error('Token expired')); // Throw token expired error
    }

    const newRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`), // Set the Authorization header with the token
    });
    return next(newRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          authService.logout(); // Logout if unauthorized
          router.navigate(['/login']); // Redirect to login page
        }
        return throwError(() => error); // Throw the error
      })
    );
  } else {
    return next(req); // Pass the request as is if no token or excluded path
  }
};
