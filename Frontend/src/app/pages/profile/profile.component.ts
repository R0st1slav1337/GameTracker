import {Component, signal} from '@angular/core';
import { ApiService } from '../../../services/api.service';
import {LibraryResponse} from '../../models';
import {FormsModule} from '@angular/forms';

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
