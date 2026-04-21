import {Component, input, output} from '@angular/core';
import { FormsModule} from '@angular/forms';
import { ManualLibrary } from '../../../models';
import {ApiService} from '../../../../services/api.service';

@Component({
  selector: 'app-manual-adding-component',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './manual-adding.component.html',
  styleUrl: './manual-adding.component.css',
})
export class ManualAddingComponent {
  constructor(private api: ApiService) {}
  open = input<boolean>(false);
  success = output<boolean>();
  title: string = '';
  description: string = '';
  release_date: string = '';
  rating: number = 0;
  genres: string = "";
  image: string = '';
  status: string = '';


  done(){
    const request = {
      title: this.title,
      description: this.description,
      release_date: this.release_date,
      rating: this.rating,
      genres: this.genres,
      image: this.image,
      status: this.status,
    }
    this.api.addManualGame(request).subscribe({
      next: ()=>{
        alert("Added successfully");
        this.success.emit(true);
      },
      error: ()=>{
        alert("An error occurred");
        console.log(request);
      }
    })
  }
}
