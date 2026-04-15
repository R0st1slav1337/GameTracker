import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <h2>Profile</h2>
  `
})

export class ProfileComponent {
  constructor(private api: ApiService) {}

  logout() {
    const refresh = localStorage.getItem('refresh');

    this.api.logout(refresh!).subscribe(() => {
      localStorage.clear();
      window.location.href = '/login';
    });
  }
}
