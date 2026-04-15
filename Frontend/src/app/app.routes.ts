import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { GamesComponnet } from './pages/games/games.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'games', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'games', component: GamesComponnet },
  { path: 'profile', component: ProfileComponent },
];
