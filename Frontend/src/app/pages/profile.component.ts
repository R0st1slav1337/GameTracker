import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <h2>Profile</h2>

    <p><b>Username:</b> {{ profile?.username }} </p>
    <p><b>Bio:</b> {{ profile?.bio }} </p>

    <button (click)="load()">Refresh</button>
    <button (click)="logout()">Logout</button>

    <h3>My Library</h3>
    <ul>
      @for (item of library; track item.id) {
        <li>{{ item.game_title }} - {{ item.status }}</li>
      }
    </ul>
  `
})

export class ProfileComponent {
  profile: any;
  library: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
    this.loadLibrary();
  }

  load() {
    this.api.getProfile().subscribe((data: any)=> {
      this.profile = data;
    });
  }

  loadLibrary() {
    this.api.getLibrary().subscribe((data: any)=> {
      this.library = data;
    })
  }

  logout() {
    const refresh = localStorage.getItem('refresh');

    this.api.logout(refresh!).subscribe(() => {
      localStorage.clear();
      window.location.href = '/login';
    });
  }
}
