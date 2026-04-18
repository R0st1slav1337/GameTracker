import {Component, inject, signal} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../../services/games.service';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  templateUrl: './game-detail.component.html',
  styleUrl: './game-detail.component.css'
})
export class GameDetailComponent {

  route = inject(ActivatedRoute);
  gameService = inject(GameService);
  game_details = signal<any>("")
  loading = signal<boolean>(false)


  ngOnInit(){
    this.loading.set(true);
    this.route.paramMap.subscribe(params => {
      console.log(params);
      const id: number = Number(params.get('id'))
      console.log(id);
      this.gameService.getGameDetail(id).subscribe({
        next: (res) => {
          res.description = this.textCleaner(res.description);
          this.game_details.set(res)
          console.log(this.game_details);
          this.loading.set(false);
        }
      })
    })
  }

  textCleaner(html: string){
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

}
