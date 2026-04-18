import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { GamesComponent } from './pages/games/games.component';
import { ProfileComponent } from './pages/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { GameDetailComponent } from './pages/game-detail.component/game-detail.component';
import { PublicProfileComponent } from './pages/public-profile.component';
import {LibraryComponent} from './pages/library/library.component/library.component';

export const routes: Routes = [
  { path: '', redirectTo: 'games', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'games', component: GamesComponent },
  { path: 'games/:id', component: GameDetailComponent },

  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:username', component: PublicProfileComponent },

  { path: 'library', component: LibraryComponent },
];
