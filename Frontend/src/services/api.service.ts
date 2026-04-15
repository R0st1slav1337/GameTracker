import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private baseURL = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) { }

  login(data: any) {
    return this.http.post(this.baseURL + 'auth/login/', data);
  }

  getGames() {
    return this.http.get(this.baseURL + 'games/');
  }

  logout(refresh: string) {
    return this.http.post(this.baseURL + 'auth/logout/', {refresh});
  }
}
