import { Routes } from '@angular/router';
import { PlaylistListComponent } from './components/playlist-list/playlist-list.component';
import { PlaylistCreateComponent } from './components/playlist-create/playlist-create.component';
import { PlaylistDetailComponent } from './components/playlist-detail/playlist-detail.component';

export const routes: Routes = [
  { path: '', component: PlaylistListComponent },
  { path: 'create', component: PlaylistCreateComponent },
  { path: 'playlist/:name', component: PlaylistDetailComponent },
  { path: '**', redirectTo: '' }
];