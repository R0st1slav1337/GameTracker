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
  next: string;
  previous: string;
}

interface GameDetail {
  id: number;
  name: string;
  description: string;
  released: string;
  rating: number;
  genres: string;
  image: string;
  slug: string;
}

interface Review {
  id: number;
  user: string;
  game: number;
  text: string;
  rating: number;
}

interface ReviewRequest {
  rawg_id: number;
  text: string;
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api';

  searchGames(query: string, page: number): Observable<GamesResponse> {
    return this.http.get<GamesResponse>(`${this.baseUrl}/games/?search=${query}&page=${page}`);
  }

  getGameDetail(id: number): Observable<GameDetail> {
    return this.http.get<GameDetail>(`${this.baseUrl}/games/${id}/`);
  }

  getReviews(rawgId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/reviews/?games=${rawgId}`);
  }

  addReview(data: ReviewRequest): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}/reviews/`, data);
  }
}
