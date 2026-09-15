import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth.service';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // If we get a 401 on an API request, standard behavior is to redirect to login
      // unless it is the login or check endpoint itself.
      if (error.status === 401 && !req.url.includes('/api/auth/login') && !req.url.includes('/api/auth/me')) {
        auth.user.set(null);
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

