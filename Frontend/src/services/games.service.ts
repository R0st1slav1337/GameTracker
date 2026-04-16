import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface GameCard {
  id: number;
  name: string;
  released: string;
  rating: number;
  image: string;
}

interface GamesResponse {
  count: number;
  results: GameCard[];
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api';

  searchGames(query: string): Observable<GamesResponse> {
    return this.http.get<GamesResponse>(`${this.baseUrl}/games/?search=${query}`);
  }

  getGameDetail(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/games/${id}/`);
  }
}
