import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService} from '../../../services/api.service';

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

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const username = params.get('username');

      if (!username) {
        this.error.set('Username was not provided');
        this.loading.set(false);
        return;
      }

      this.loadProfile(username);
    });
  }

  loadProfile(username: string) {
    this.loading.set(true);
    this.error.set('');

    this.api.getUserProfile(username).subscribe({
      next: (data: any) => {
        this.profile.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.profile.set(null);
        this.loading.set(false);
        this.error.set('Failed to load profile.');
      }
    });
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}
