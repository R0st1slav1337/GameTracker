import {Component, signal} from '@angular/core';
import { ApiService } from '../../services/api.service';
import {LibraryResponse} from '../models';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule
  ],
  template: `
    <h2>Profile</h2>
    <p><img src = "{{profile()?.avatar}}" alt = "ava"></p>

    <p><b>Username:</b> {{ profile()?.username }} </p>
    <p><b>Bio:</b> {{ profile().bio }} </p>

    <button (click)="load()">Refresh</button>
    <button (click)="logout()">Logout</button>
    <button class="update" (click)='settings()'>Settings</button>
    @if (setting()) {
      <form>
        Username:<input name = 'usrname' type="text" placeholder="Username" value='{{profile()?.username}}' [(ngModel)]="this.username">
        Bio:<input name = 'bio' type="text" placeholder="bio" [(ngModel)] = "this.bio">
        PFP:<input name = 'pfp' type="text" placeholder="profile picture" [(ngModel)] = "this.pfp">
        <div>
          <input name = "visibility" type = "radio" [(ngModel)] = 'is_public' value = "{{true}}" checked (click)="Show()">Visible
          <input name = "visibility" type = "radio" [(ngModel)] = 'is_public' value = "{{false}}" (click)="Show()">Invisible
        </div>
        <button (click)="updateProfile()">Apply</button>
      </form>
    }

    <h3>My Library</h3>
    <ul>
      @for (item of library(); track item.id) {
        <li>{{ item.game.title }} - {{ item.status }}</li>
      }
    </ul>
  `
})

export class ProfileComponent {
  profile = signal<any>('');
  library = signal<LibraryResponse[]>([]);
  setting = signal<boolean>(false)
  username: string = '';
  pfp: string = '';
  bio: string = '';
  is_public: boolean = true;

  ngOnInit() {
    this.load();
    this.loadLibrary();
    console.log(this.profile().username);
  }

  constructor(private api: ApiService) {}



  load() {
    this.api.getProfile().subscribe((data: any)=> {
      this.profile.set(data);
      this.username = data.username;
      this.bio = data.bio;
      this.pfp = data.avatar;
      console.log(data);
    });
  }

  loadLibrary() {
    this.api.getLibrary().subscribe((data: any)=> {
      this.library.set(data);
    })
  }

  logout() {
    const refresh = localStorage.getItem('refresh');

    this.api.logout(refresh!).subscribe(() => {
      localStorage.clear();
      window.location.href = '/login';
    });
  }

  updateProfile() {
    let data = {
      username: this.username,
      bio: this.bio,
      avatar: this.pfp
    }
    this.api.putMyProfile(data).subscribe((data: any)=> {
      alert("Profile successfully updated");
      this.load();
    })
  }

  settings() {
    this.setting.set(!this.setting());
  }

  Show(){
    console.log(this.is_public)
  }
}
