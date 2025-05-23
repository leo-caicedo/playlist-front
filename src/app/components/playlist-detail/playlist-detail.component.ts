// src/app/components/playlist-detail/playlist-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { PlaylistResponse } from '../../models/playlist.model';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [CommonModule, RouterLink], // Agregado RouterLink aquí
  template: `
    <div class="playlist-detail-container">
      <div class="header">
        <button class="btn btn-secondary" (click)="goBack()">
          ← Volver a la Lista
        </button>
      </div>

      <div *ngIf="loading" class="loading">
        Cargando detalles de la lista...
      </div>

      <div *ngIf="error" class="error">
        {{ error }}
        <button class="btn btn-secondary" (click)="loadPlaylist()">
          Reintentar
        </button>
      </div>

      <div *ngIf="!loading && !error && playlist" class="playlist-content">
        <div class="playlist-info">
          <h1>{{ playlist.nombre }}</h1>
          <p class="description">{{ playlist.descripcion }}</p>
          <div class="stats">
            <span class="stat">
              <strong>{{ playlist.canciones.length }}</strong> 
              {{ playlist.canciones.length === 1 ? 'canción' : 'canciones' }}
            </span>
          </div>
          
          <div class="actions">
            <button class="btn btn-danger" (click)="deletePlaylist()">
              Eliminar Lista
            </button>
          </div>
        </div>

        <div class="songs-section">
          <h2>Canciones</h2>
          
          <div *ngIf="playlist.canciones.length === 0" class="empty-songs">
            <p>Esta lista no tiene canciones agregadas.</p>
            <a [routerLink]="['/edit', playlist.nombre]" class="btn btn-primary">
              Agregar Canciones
            </a>
          </div>

          <div *ngIf="playlist.canciones.length > 0" class="songs-list">
            <div class="songs-header">
              <div class="header-cell">#</div>
              <div class="header-cell">Título</div>
              <div class="header-cell">Artista</div>
              <div class="header-cell">Álbum</div>
              <div class="header-cell">Año</div>
              <div class="header-cell">Género</div>
            </div>
            
            <div *ngFor="let cancion of playlist.canciones; let i = index" 
                 class="song-row"
                 [class.even]="i % 2 === 0">
              <div class="cell number">{{ i + 1 }}</div>
              <div class="cell title">
                <strong>{{ cancion.titulo || 'Sin título' }}</strong>
              </div>
              <div class="cell artist">{{ cancion.artista || 'Artista desconocido' }}</div>
              <div class="cell album">{{ cancion.album || '-' }}</div>
              <div class="cell year">{{ cancion.anno || '-' }}</div>
              <div class="cell genre">{{ cancion.genero || '-' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .playlist-detail-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 30px;
    }

    .playlist-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .playlist-info {
      padding: 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .playlist-info h1 {
      margin: 0 0 15px 0;
      font-size: 2.5em;
      font-weight: bold;
    }

    .description {
      font-size: 1.2em;
      margin-bottom: 20px;
      opacity: 0.9;
      font-style: italic;
    }

    .stats {
      margin-bottom: 25px;
    }

    .stat {
      background: rgba(255,255,255,0.2);
      padding: 8px 15px;
      border-radius: 20px;
      font-size: 0.9em;
    }

    .actions {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .songs-section {
      padding: 30px;
    }

    .songs-section h2 {
      margin: 0 0 25px 0;
      color: #333;
      font-size: 1.8em;
    }

    .songs-list {
      background: #f8f9fa;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #dee2e6;
    }

    .songs-header {
      display: grid;
      grid-template-columns: 50px 1fr 1fr 1fr 80px 120px;
      background: #e9ecef;
      border-bottom: 2px solid #dee2e6;
      font-weight: bold;
      color: #495057;
    }

    .header-cell {
      padding: 15px 10px;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .song-row {
      display: grid;
      grid-template-columns: 50px 1fr 1fr 1fr 80px 120px;
      border-bottom: 1px solid #dee2e6;
      transition: background-color 0.2s;
    }

    .song-row:hover {
      background-color: #e3f2fd;
    }

    .song-row.even {
      background-color: #ffffff;
    }

    .cell {
      padding: 15px 10px;
      display: flex;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .cell.number {
      justify-content: center;
      font-weight: bold;
      color: #666;
    }

    .cell.title strong {
      color: #2c3e50;
    }

    .cell.artist {
      color: #666;
    }

    .cell.album, .cell.year, .cell.genre {
      color: #888;
      font-size: 0.9em;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-block;
      font-weight: 500;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
      transform: translateY(-1px);
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
      transform: translateY(-1px);
    }

    .btn-warning {
      background-color: #ffc107;
      color: #212529;
    }

    .btn-warning:hover {
      background-color: #e0a800;
      transform: translateY(-1px);
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
      transform: translateY(-1px);
    }

    .loading, .error {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .error {
      color: #dc3545;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      margin: 20px 0;
    }

    .empty-songs {
      text-align: center;
      padding: 40px;
      color: #666;
      background: #f8f9fa;
      border-radius: 8px;
      border: 2px dashed #dee2e6;
    }

    .empty-songs p {
      margin-bottom: 20px;
      font-size: 1.1em;
    }

    @media (max-width: 768px) {
      .playlist-info h1 {
        font-size: 2em;
      }
      
      .actions {
        flex-direction: column;
      }
      
      .songs-header, .song-row {
        grid-template-columns: 40px 2fr 1fr 1fr;
      }
      
      .header-cell:nth-child(5), 
      .header-cell:nth-child(6),
      .cell:nth-child(5), 
      .cell:nth-child(6) {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .songs-header, .song-row {
        grid-template-columns: 40px 2fr 1fr;
      }
      
      .header-cell:nth-child(4),
      .cell:nth-child(4) {
        display: none;
      }
    }
  `]
})
export class PlaylistDetailComponent implements OnInit {
  playlist: PlaylistResponse | null = null;
  loading = false;
  error: string | null = null;
  playlistName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistService: PlaylistService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.playlistName = params['name'];
      if (this.playlistName) {
        this.loadPlaylist();
      }
    });
  }

  loadPlaylist(): void {
    this.loading = true;
    this.error = null;
    
    this.playlistService.getPlaylistByName(this.playlistName).subscribe({
      next: (playlist) => {
        this.playlist = playlist;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('Error cargando playlist:', error);
      }
    });
  }

  deletePlaylist(): void {
    if (this.playlist && confirm(`¿Estás seguro de que quieres eliminar la lista "${this.playlist.nombre}"?`)) {
      this.playlistService.deletePlaylist(this.playlist.nombre).subscribe({
        next: () => {
          alert('Lista eliminada correctamente');
          this.router.navigate(['/']);
        },
        error: (error) => {
          alert(`Error al eliminar la lista: ${error.message}`);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}