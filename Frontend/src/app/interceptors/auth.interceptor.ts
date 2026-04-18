import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access');
  console.log("INTERCEPT:", req.url);

  if (req.url.includes('auth/')) {
      return next(req)
  }

  if (token) {
    console.log(token);
    console.log(req.url);
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
}
