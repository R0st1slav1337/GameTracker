import {HttpClient, HttpInterceptorFn} from '@angular/common/http';
import {catchError, switchMap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {inject} from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access');
  const router = inject(Router);
  const http = inject(HttpClient);
  let authReq = req;
  console.log("INTERCEPT:", req.url);

  if (req.url.includes('auth/')) {
      return next(req)
  }

  if (token) {
    console.log(req.url);
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  else{
    router.navigate(['/login']);
  }

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        const refresh = localStorage.getItem('refresh');

        if (!refresh) {
          router.navigate(['/login']);
          return throwError(() => err);
        }

        return http.post('/api/auth/refresh/', { refresh }).pipe(
          switchMap((res: any) => {
            localStorage.setItem('access', res.access);

            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.access}`
              }
            });

            return next(newReq);
          }),
          catchError(() => {

            localStorage.clear();
            router.navigate(['/login']);
            return throwError(() => err);
          })
        );
      }

      return throwError(() => err);
    })
  );
}
