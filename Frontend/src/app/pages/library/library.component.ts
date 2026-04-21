import {Component, signal} from '@angular/core'
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms'
import {Library, LibraryResponse} from '../../models';
import {ManualAddingComponent} from './manual-adding.component/manual-adding.component';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [FormsModule, ManualAddingComponent],
  templateUrl: './library.component.html',
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

  update(item: any, newStatus: 'want' | 'playing' | 'played') {
    this.api.updateLibrary(item.id, { status: newStatus }).subscribe({
      next: () => this.load(),
      error: () => alert('Failed to update status'),
    });
  }

  delete(id: number) {
    this.api.deleteLibrary(id).subscribe({
      next: () => this.load(),
      error: () => alert('Failed to delete game'),
    });
  }

  toggleManual() {
    this.manual.set(!this.manual());
  }
}
