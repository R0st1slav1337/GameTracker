export interface Game{
  id: number;
  name: string;
  released: string;
  rating: number;
  image: string;
}

export interface GamesApiResponse {
  count: number;
  next: string|null;
  previous: string|null;
  results: Game[];
}

export interface Library {
  rawg_id: number;
  status: string;
}
