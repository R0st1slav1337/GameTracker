import { Component } from '@angular/core';

@Component({
  selector: 'app-games',
  standalone: true,
  template: `
    <h2>Games</h2>
    <button (click)="loadGames()">Load Games</button>
  `
})

export class GamesComponent {
  loadGames() {
    console.log('Load Games');
  }
}
