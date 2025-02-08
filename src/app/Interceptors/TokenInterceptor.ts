import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../Services/AuthService';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const newRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });
  return next(newRequest);
};
