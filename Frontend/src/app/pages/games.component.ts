import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-games',
  standalone: true,
  template: `
    <h2>Games</h2>
    <button (click)="loadGames()">Load Games</button>
  `
})

export class GamesComponent {
  constructor(private api: ApiService) {}

  games: any[] = [];

  loadGames() {
    this.api.getGames().subscribe((data: any) => {
      this.games = data;
    });
  }
}
