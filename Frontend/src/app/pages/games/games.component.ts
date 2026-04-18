import {Component, inject, signal} from '@angular/core';
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
  games = signal<any[]>([])
  loading = false;
  error = '';
  page_number = signal<number>(1)
  next = signal<string>('')
  previous = signal<string>('')

  private gamesService = inject(GameService);
  private router = inject(Router);


  search(): void {
    this.loading = true;
    this.error = '';
    this.loadGames(this.page_number());
  }

  goToGame(id: number): void {
    this.router.navigate([`/games`, id]);
  }

  loadGames(page_num = 1) {
    this.gamesService.searchGames(this.query,page_num).subscribe({
      next: (res) => {
        this.games.set(res.results)
        this.loading = false;
        this.next.set(res.next)
        this.previous.set(res.previous)
      },
      error: () => {
        this.error = 'Failed to load games';
        this.loading = false;
      }
    });
  }

  ngOnInit() {
    this.loading = true;
    this.error = '';
    this.loadGames();
  }

  onForward(): boolean{
    if(this.next()!='' && this.next()!=null){
      return true;
    }
    return false;
  }

  onBackward(): boolean{
    if(this.previous()!='' && this.previous()!=null){
      return true;
    }
    return false;
  }

  forward(): void {
    this.loading = true;
    if(this.onForward()){
      console.log("forward");
      this.page_number.update((value:number)=> value+1);
      this.loadGames(this.page_number());
    }
  }

  backward(): void {
    this.loading = true;
    if(this.onBackward()){
      console.log("backward");
      this.page_number.update((value:number) => value-1);
      this.loadGames(this.page_number());
    }
  }
}
