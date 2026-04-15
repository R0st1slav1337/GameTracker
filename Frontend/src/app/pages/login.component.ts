import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>Login</h2>
    <input [(ngModel)]="username" placeholder="Username">
    <input [(ngModel)]="password" type="password" placeholder="Password">
    <button (click)="login()">Login</button>
  `
})

export class LoginComponent {
  username = '';
  password = '';

  constructor(private api: ApiService) { }

  login() {
    this.api.login({
      username: this.username,
      password: this.password,
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.access);
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }
}
