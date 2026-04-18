import { Component } from '@angular/core'
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>My Library</h2>

    <input [(ngModel)]="title" placeholder="Game title">
    <select [(ngModel)]="status">
      <option value="want">Want</option>
      <option value="playing">Playing</option>
      <option value="played">Played</option>
    </select>
    <button (click)="addGame()">Add Game</button>

    <ul>
      @for (item of library; track item.id) {
        <li>
          {{ item.game.title }} - {{ item.status }}

          <select [(ngModel)]="item.status" (change)="update(item)">
            <option value="want">Want</option>
            <option value="playing">Playing</option>
            <option value="played">Played</option>
          </select>

          <button (click)="delete(item.id)">Delete</button>
        </li>
      }
    </ul>
  `
})

export class LibraryComponent {

  library: any[] = [];
  title = '';
  status = 'want';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getLibrary().subscribe((data: any) => {
      this.library = data;
    });
  }

  addGame() {
    this.api.addToLibrary({
      title: this.title,
      status: this.status,
    }).subscribe(() => this.load());
  }

  update(item: any) {
    this.api.updateLibrary(item.id, { status: item.status }).subscribe();
  }

  delete(id: number) {
    this.api.deleteLibrary(id).subscribe(() => this.load());
  }
}
