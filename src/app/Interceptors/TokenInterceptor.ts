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

  const excludedPaths = ['/login', '/register'];

  const isExcluded = excludedPaths.some((path) => req.url.includes(path));

  if (token && !isExcluded) {
    const isTokenExpired = authService.isTokenExpired(token);
    if (isTokenExpired) {
      authService.logout();
      router.navigate(['/login']);
      return throwError(() => new Error('Token expired'));
    }

    const newRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(newRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          authService.logout();
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  } else {
    return next(req);
  }
};
