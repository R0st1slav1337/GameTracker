import {Component, signal} from '@angular/core'
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms'
import {Library, LibraryResponse} from '../../models';
import {ManualAddingComponent} from './manual-adding.component/manual-adding.component';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [FormsModule, ManualAddingComponent],
  template: `
    <h2>My Library</h2>
    <button (click) = "toggleManual()">Haven't found your favorite game? Add it here!</button>
    @if(manual()){
      <app-manual-adding-component [open]="manual()"  (success) = 'load()'></app-manual-adding-component>
    }
    <div class = "games">
      @for (item of library(); track item.game) {
        <div class = "library_card">
          {{ item.game.title }} - {{ item.status }}
            <img class = "game_image" src = "{{item.game.image}}">

          <select [(ngModel)]="item.status" (change)="update(item)">
            <option value="want">Want</option>
            <option value="playing">Playing</option>
            <option value="played">Played</option>
          </select>
          <button (click)="delete(item.id)">Delete</button>
        </div>
      }
    </div>
  `,
  styleUrl: "./library.component.css"
})

export class LibraryComponent {

  library = signal<LibraryResponse[]>([]);
  title = '';
  status = 'want';
  manual = signal<boolean>(false);

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getLibrary().subscribe({
      next: (data: any) => {
        this.library.set(data);
      },
      error: () => {
        alert('Failed to load library');
      }
    });
  }

  addGame() {
    this.api.addLibrary({
      title: this.title,
      status: this.status,
    }).subscribe({
      next: () => this.load(),
      error: () => alert('Failed to add game'),
    });
  }

  update(item: any) {
    this.api.updateLibrary(item.id, { status: item.status }).subscribe();
  }

  delete(id: number) {
    this.api.deleteLibrary(id).subscribe(() => this.load());
  }

  toggleManual() {
    this.manual.set(!this.manual());
  }
}
