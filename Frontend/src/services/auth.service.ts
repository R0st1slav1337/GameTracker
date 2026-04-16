import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  access: string;
  refresh: string;
}

interface RegisterResponse {
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseURL = 'http://127.0.0.1:8000/api';

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseURL}/auth/login/`, {
      username, password
    }).pipe(
      tap((response) => {
        localStorage.setItem('access', response.access);
        localStorage.setItem('refresh', response.refresh);
      })
    );
  }

  register(username: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseURL}/auth/register/`, {
      username, password
    });
  }

  refreshToken(): Observable<{ access: string}> {
    const refresh = localStorage.getItem('refresh');

    return this.http.post<{ access: string}>(`${this.baseURL}/auth/refresh/`, {
      refresh
    }).pipe(
      tap((response) => {
        localStorage.setItem('access', response.access);
      })
    );
  }

  logout(): Observable<any> {
    const refresh = localStorage.getItem('refresh');

    return this.http.post(`${this.baseURL}/auth/logout/`, { refresh }).pipe(
      tap(() => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      })
    );
  }

  clearTokens(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access');
  }
}
