import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { PlaylistResponse } from '../../models/playlist.model';

@Component({
  selector: 'app-playlist-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="playlist-list-container">
      <div class="header">
        <h2>Listas de Reproducción</h2>
      </div>

      <div *ngIf="loading" class="loading">
        Cargando listas...
      </div>

      <div *ngIf="error" class="error">
        {{ error }}
        <button class="btn btn-secondary" (click)="loadPlaylists()">
          Reintentar
        </button>
      </div>

      <div *ngIf="!loading && !error" class="playlists-grid">
        <div *ngFor="let playlist of playlists" class="playlist-card">
          <h3>{{ playlist.nombre }}</h3>
          <p class="description">{{ playlist.descripcion }}</p>
          <p class="song-count">{{ playlist.canciones.length }} canciones</p>
          
          <div class="card-actions">
            <button class="btn btn-info" (click)="viewPlaylist(playlist.nombre)">
              Ver Detalles
            </button>
            <button class="btn btn-danger" (click)="deletePlaylist(playlist.nombre)">
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !error && playlists.length === 0" class="empty-state">
        <p>No hay listas de reproducción disponibles.</p>
        <button class="btn btn-primary" (click)="navigateToCreate()">
          Crear la primera lista
        </button>
      </div>
    </div>
  `,
  styles: [`
    .playlist-list-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e0e0e0;
    }

    .header h2 {
      margin: 0;
      color: #333;
    }

    .playlists-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .playlist-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .playlist-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .playlist-card h3 {
      margin: 0 0 10px 0;
      color: #2c3e50;
      font-size: 1.4em;
    }

    .description {
      color: #666;
      margin-bottom: 10px;
      font-style: italic;
    }

    .song-count {
      color: #888;
      font-size: 0.9em;
      margin-bottom: 15px;
    }

    .card-actions {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background-color: #2980b9;
    }

    .btn-info {
      background-color: #17a2b8;
      color: white;
    }

    .btn-info:hover {
      background-color: #138496;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    .loading, .error, .empty-state {
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

    .empty-state {
      background-color: #f8f9fa;
      border-radius: 8px;
      margin-top: 40px;
    }
  `]
})
export class PlaylistListComponent implements OnInit {
  playlists: PlaylistResponse[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private playlistService: PlaylistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPlaylists();
  }

  loadPlaylists(): void {
    this.loading = true;
    this.error = null;
    
    this.playlistService.getAllPlaylists().subscribe({
      next: (playlists) => {
        this.playlists = playlists;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('Error cargando playlists:', error);
      }
    });
  }

  viewPlaylist(nombre: string): void {
    this.router.navigate(['/playlist', nombre]);
  }

  navigateToCreate(): void {
    this.router.navigate(['/create']);
  }

  deletePlaylist(nombre: string): void {
    if (confirm(`¿Estás seguro de que quieres eliminar la lista "${nombre}"?`)) {
      this.playlistService.deletePlaylist(nombre).subscribe({
        next: () => {
          this.loadPlaylists(); // Recargar la lista
          alert('Lista eliminada correctamente');
        },
        error: (error) => {
          alert(`Error al eliminar la lista: ${error.message}`);
        }
      });
    }
  }
}