import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService} from '../../../services/api.service';
import {LibraryResponse} from '../../models';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent {
  profile = signal<any>(null);
  loading= signal<boolean>(true);
  error = signal<string>('');
  library = signal<any[]>([]);
  reviews = signal<any[]>([])

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const username = params.get('username');

      if (!username) {
        this.error.set('Username was not provided');
        this.loading.set(false);
        return;
      }

      this.loadAll(username);
    });
  }

  loadAll(username: string) {
    this.loading.set(true);
    this.error.set('');

    this.api.getUserProfile(username).subscribe({
      next: (data: any) => {
        this.profile.set(data);
        this.loadLibrary(username);
        this.loadReviews(username);
      },
      error: () => {
        this.profile.set(null);
        this.loading.set(false);
        this.error.set('Failed to load profile.');
        this.library.set([]);
        this.reviews.set([]);
      }
    });
  }

  loadLibrary(username: string) {
    this.api.getUserLibrary(username).subscribe({
      next: (data: any) => {
        this.library.set(data);
        this.finishLoadingIfDone();
      },
      error: () => {
        this.library.set([])
        this.finishLoadingIfDone();
      }
    });
  }

  loadReviews(username: string) {
    this.api.getUserReviews(username).subscribe({
      next: (data: any) => {
        this.reviews.set(data);
        this.finishLoadingIfDone()
      },
      error: () => {
        this.reviews.set([]);
        this.finishLoadingIfDone();
      }
    });
  }

  finishLoadingIfDone() {
    if (this.profile()) {
      this.loading.set(false);
    }
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}
