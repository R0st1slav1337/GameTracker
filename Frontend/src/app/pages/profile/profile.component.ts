import {Component, signal} from '@angular/core';
import { ApiService } from '../../../services/api.service';
import {LibraryResponse} from '../../models';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent {
  profile = signal<any>('');
  library = signal<LibraryResponse[]>([]);
  reviews = signal<any[]>([]);
  setting = signal<boolean>(false)

  username: string = '';
  pfp: string = '';
  bio: string = '';
  is_public: boolean = true;

  searchQuery: string = '';
  searchResults = signal<any[]>([]);
  searchError = signal<string>('');

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.load();
  }


  load() {
    this.api.getProfile().subscribe({
      next: (data: any) => {
        this.profile.set(data);
        this.username = data.username;
        this.bio = data.bio;
        this.pfp = data.pfp;
        this.is_public = data.is_public;

        this.loadLibrary();
        this.loadReviews();
      },
      error: () => {
        alert('Failed to load profile');
      }
    });
  }

  loadLibrary() {
    if (!this.username) return;

    this.api.getUserLibrary(this.username).subscribe({
      next: (data: any) => {
        this.library.set(data);
      },
      error: () => {
        this.library.set([]);
      }
    });
  }

  loadReviews() {
    if (!this.username) return;

    this.api.getUserReviews(this.username).subscribe({
      next: (data: any) => {
        this.reviews.set(data);
      },
      error: () => {
        this.reviews.set([])
      }
    });
  }

  logout() {
    const refresh = localStorage.getItem('refresh');

    if (!refresh) {
      localStorage.clear();
      window.location.href = '/login';
      return;
    }

    this.api.logout(refresh).subscribe({
      next: () => {
        localStorage.clear();
        window.location.href = '/login';
      },
      error: () => {
        localStorage.clear();
        window.location.href = '/login';
      }
    });
  }

  updateProfile() {
    const data = {
      username: this.username,
      bio: this.bio,
      avatar: this.pfp
    };

    this.api.putMyProfile(data).subscribe({
      next: () => {
        alert("Profile successfully updated");
        this.load();
      },
      error: () => {
        alert('Failed to update profile');
      }
    });
  }

  settings() {
    this.setting.set(!this.setting());
  }

  searchProfiles() {
    const query = this.searchQuery.trim();

    if (!query) {
      this.searchResults.set([]);
      this.searchError.set('');
      return;
    }

    this.api.searchProfile(query).subscribe({
      next: (data: any) => {
        this.searchResults.set(data);
        this.searchError.set('');
      },
      error: () => {
        this.searchResults.set([]);
        this.searchError.set('Failed to search profile');
      }
    });
  }

  openProfile(username: string) {
    this.router.navigate(['/profile', username]);
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults.set([]);
    this.searchError.set('');
  }

  Show(){
    console.log(this.is_public)
  }
}
