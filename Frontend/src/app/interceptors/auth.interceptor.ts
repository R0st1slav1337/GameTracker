import {HttpClient, HttpInterceptorFn} from '@angular/common/http';
import {catchError, switchMap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {inject} from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access');
  const refresh = localStorage.getItem('refresh');
  const router = inject(Router);
  const http = inject(HttpClient);

  const isLoginRequest = req.url.includes('/auth/login/');
  const isRegisterRequest = req.url.includes('/auth/register/');
  const isRefreshRequest = req.url.includes('/auth/refresh/');

  // These requests don't need to receive access token
  if (isLoginRequest || isRefreshRequest || isRegisterRequest) {
      return next(req);
  }

  // All others, including Logout, must be with Authorization
  const authReq = token
    ? req.clone({
        setHeaders:
          {Authorization: `Bearer ${token}`,
        },
    })
    : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status !== 401 ) {
        return throwError(() => err);
      }

      // If no refresh - go to login
      if (!refresh) {
        localStorage.clear();
        router.navigate(['/login']);
        return throwError(() => err);
      }

      // Don't try to update token for refresh-request
      if (!isRefreshRequest) {
        localStorage.clear();
        router.navigate(['/login']);
        return throwError(() => err);
      }

      return http.post<any>('http://127.0.0.1:8000/api/auth/refresh', { refresh }).pipe(
        switchMap((res) => {
          localStorage.setItem('access', res.access);

          const newReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${res.access}`,
            },
          });

          return next(newReq);
        }),
        catchError((refreshErr) => {
          localStorage.clear();
          router.navigate(['/login']);
          return throwError(() => refreshErr);
        })
      );
    })
  );
}
