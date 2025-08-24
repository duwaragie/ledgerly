import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        router.navigate(['/login']);
      }

      const errorMessage = error.error?.message || error.statusText;
      console.error('HTTP Error:', errorMessage);
      return throwError(() => error);
    })
  );
};
