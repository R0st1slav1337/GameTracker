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
export interface localGame{
  rawg_id: number;
  title: string;
  description: string;
  release_date: string;
  rating: number
  genres: string[];
  image: string;
  slug: string;
}

export interface ManualLibrary{

  title: string;
  description: string;
  release_date: string;
  rating: number
  genres: string[];
  image: string;

}

export interface LibraryResponse {
  id: number;
  status:string;
  game: localGame;
}
