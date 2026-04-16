import { Component, inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { GameService } from '../../../services/games.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-games',
  standalone: true,
  templateUrl: './games.component.html',
  styleUrl: './games.component.css',
  imports: [CommonModule, FormsModule]
})

export class GamesComponent {
  constructor(private api: ApiService) {}

  query = ''
  games: any[] = [];
  loading = false;
  error = '';

  private gamesService = inject(GameService);
  private router = inject(Router);

  search(): void {
    this.loading = true;
    this.error = '';

    this.gamesService.searchGames(this.query).subscribe({
      next: (res) => {
        this.games = res.results;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load games';
        this.loading = false;
      }
    });
  }

  goToGame(id: number): void {
    this.router.navigate([`/games`, id]);
  }

  loadGames() {
    this.api.getGames().subscribe((data: any) => {
      this.games = data;
    });
  }
}
