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

  addManualGame(data: any) {
    return this.http.post(this.baseURL + 'library/manual/', data);
  }

  getLibrary() {
    return this.http.get(this.baseURL + 'library/');
  }

  addLibrary(data: any) {
    return this.http.post(this.baseURL + 'library/', data);
  }

  updateLibrary(id: number, data: any) {
    return this.http.put(this.baseURL + `library/${id}/`, data);
  }

  deleteLibrary(id: number) {
    return this.http.delete(this.baseURL + `library/${id}/`);
  }

  getProfile() {
    return this.http.get(this.baseURL + 'profile/me/');
  }

  putMyProfile(data: any) {
    return this.http.put(this.baseURL + 'profile/me/', data);
  }

  searchProfile(query: string) {
    return this.http.get(`${this.baseURL}/profile/search/?q=${query}`);
  }
}
