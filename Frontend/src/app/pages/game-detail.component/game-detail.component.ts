import {Component, inject, signal} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../../services/games.service';
import {LibraryService} from '../../../services/library.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  templateUrl: './game-detail.component.html',
  styleUrl: './game-detail.component.css',
  imports: [FormsModule],
})
export class GameDetailComponent {

  route = inject(ActivatedRoute);
  gameService = inject(GameService);
  libraryService = inject(LibraryService);
  game_details = signal<any>("");
  loading = signal<boolean>(false);
  choose = signal<boolean>(false);
  xurl = 'Button.assets/x.png'
  status = ''
  reviews = signal<any[]>([]);
  reviewText = '';
  reviewRating = 5;


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
          this.loadReviews();
        }
      })
    })
  }

  textCleaner(html: string){
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  toggleChoose(){
    console.log(this.choose());
    this.choose.set(!this.choose());
  }

  addToLib(){
    this.toggleChoose();
    const request = {
      rawg_id : this.game_details().id,
      status : this.status,
    }
    this.libraryService.addToLibrary(request).subscribe({
      next: () => {
        alert('Added to library');
      },
      error: () => {
        alert('Failed to add library');
      }
    });

  }

  loadReviews(){
    this.gameService.getReviews(this.game_details().id).subscribe({
      next: (data: any) => {
        this.reviews.set(data);
      },
      error: () => {
        alert('Failed to load reviews');
        console.log(this.game_details().id);
      }
    });
  }

  submitReview(){
    const request = {
      rawg_id : this.game_details().id,
      text: this.reviewText,
      rating : this.reviewRating,
    };

    this.gameService.addReview(request).subscribe({
      next: () => {
        alert('Review added');
        this.reviewText = '';
        this.reviewRating = 5;
        this.loadReviews();
      },
      error: () => {
        alert('Error submitting review');
      }
    });
  }
}
