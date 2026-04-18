import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <h2>Profile</h2>

    <p><b>Username:</b> {{ profile?.user }} </p>
    <p><b>Bio:</b> {{ profile?.bio }} </p>

    <button (click)="load()">Refresh</button>
  `
})

export class ProfileComponent {
  profile: any;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getProfile().subscribe((data: any)=> {
      this.profile = data;
    });
  }

  logout() {
    const refresh = localStorage.getItem('refresh');

    this.api.logout(refresh!).subscribe(() => {
      localStorage.clear();
      window.location.href = '/login';
    });
  }
}
