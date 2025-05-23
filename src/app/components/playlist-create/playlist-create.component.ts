import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { Playlist, Song } from '../../models/playlist.model';

@Component({
  selector: 'app-playlist-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="create-playlist-container">
      <div class="header">
        <h2>Crear Nueva Lista de Reproducción</h2>
        <button class="btn btn-secondary" (click)="goBack()">
          Volver
        </button>
      </div>

      <form [formGroup]="playlistForm" (ngSubmit)="onSubmit()" class="playlist-form">
        <div class="form-group">
          <label for="nombre">Nombre de la Lista *</label>
          <input 
            type="text" 
            id="nombre" 
            formControlName="nombre" 
            class="form-control"
            [class.error]="isFieldInvalid('nombre')"
          >
          <div *ngIf="isFieldInvalid('nombre')" class="error-message">
            El nombre es requerido
          </div>
        </div>

        <div class="form-group">
          <label for="descripcion">Descripción *</label>
          <textarea 
            id="descripcion" 
            formControlName="descripcion" 
            class="form-control"
            rows="3"
            [class.error]="isFieldInvalid('descripcion')"
          ></textarea>
          <div *ngIf="isFieldInvalid('descripcion')" class="error-message">
            La descripción es requerida
          </div>
        </div>

        <div class="songs-section">
          <div class="songs-header">
            <h3>Canciones</h3>
            <button type="button" class="btn btn-success" (click)="addSong()">
              Agregar Canción
            </button>
          </div>

          <div formArrayName="canciones" class="songs-list">
            <div *ngFor="let song of songs.controls; let i = index" 
                 [formGroupName]="i" 
                 class="song-form">
              <div class="song-header">
                <h4>Canción {{ i + 1 }}</h4>
                <button type="button" class="btn btn-danger btn-small" (click)="removeSong(i)">
                  Eliminar
                </button>
              </div>

              <div class="song-fields">
                <div class="form-group">
                  <label>Título *</label>
                  <input 
                    type="text" 
                    formControlName="titulo" 
                    class="form-control"
                    [class.error]="isSongFieldInvalid(i, 'titulo')"
                  >
                  <div *ngIf="isSongFieldInvalid(i, 'titulo')" class="error-message">
                    El título es requerido
                  </div>
                </div>

                <div class="form-group">
                  <label>Artista *</label>
                  <input 
                    type="text" 
                    formControlName="artista" 
                    class="form-control"
                    [class.error]="isSongFieldInvalid(i, 'artista')"
                  >
                  <div *ngIf="isSongFieldInvalid(i, 'artista')" class="error-message">
                    El artista es requerido
                  </div>
                </div>

                <div class="form-group">
                  <label>Álbum</label>
                  <input 
                    type="text" 
                    formControlName="album" 
                    class="form-control"
                  >
                </div>

                <div class="form-group">
                  <label>Año</label>
                  <input 
                    type="text" 
                    formControlName="anno" 
                    class="form-control"
                  >
                </div>

                <div class="form-group">
                  <label>Género</label>
                  <input 
                    type="text" 
                    formControlName="genero" 
                    class="form-control"
                  >
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="songs.length === 0" class="empty-songs">
            <p>No hay canciones agregadas. Haz clic en "Agregar Canción" para comenzar.</p>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="submitting">
            {{ submitting ? 'Creando...' : 'Crear Lista' }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="resetForm()">
            Limpiar Formulario
          </button>
        </div>
      </form>

      <div *ngIf="error" class="error-alert">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .create-playlist-container {
      padding: 20px;
      max-width: 800px;
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

    .playlist-form {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    }

    .form-control.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
    }

    .songs-section {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .songs-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .songs-header h3 {
      margin: 0;
      color: #333;
    }

    .song-form {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 6px;
      margin-bottom: 15px;
      border: 1px solid #e9ecef;
    }

    .song-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .song-header h4 {
      margin: 0;
      color: #495057;
    }

    .song-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .song-fields .form-group:first-child,
    .song-fields .form-group:nth-child(2) {
      grid-column: span 1;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
      text-decoration: none;
      display: inline-block;
    }

    .btn-small {
      padding: 5px 10px;
      font-size: 12px;
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2980b9;
    }

    .btn-primary:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }

    .btn-success {
      background-color: #28a745;
      color: white;
    }

    .btn-success:hover {
      background-color: #218838;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    .form-actions {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      display: flex;
      gap: 15px;
    }

    .empty-songs {
      text-align: center;
      padding: 40px;
      color: #666;
      font-style: italic;
      background: #f8f9fa;
      border-radius: 6px;
      border: 2px dashed #dee2e6;
    }

    .error-alert {
      background-color: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 4px;
      border: 1px solid #f5c6cb;
      margin-top: 20px;
    }

    @media (max-width: 768px) {
      .song-fields {
        grid-template-columns: 1fr;
      }
      
      .header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class PlaylistCreateComponent {
  playlistForm: FormGroup;
  submitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private playlistService: PlaylistService,
    private router: Router
  ) {
    this.playlistForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      canciones: this.fb.array([])
    });
  }

  get songs(): FormArray {
    return this.playlistForm.get('canciones') as FormArray;
  }

  addSong(): void {
    const songForm = this.fb.group({
      titulo: ['', Validators.required],
      artista: ['', Validators.required],
      album: [''],
      anno: [''],
      genero: ['']
    });
    
    this.songs.push(songForm);
  }

  removeSong(index: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta canción?')) {
      this.songs.removeAt(index);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.playlistForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isSongFieldInvalid(songIndex: number, fieldName: string): boolean {
    const song = this.songs.at(songIndex);
    const field = song.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.playlistForm.valid) {
      this.submitting = true;
      this.error = null;

      const playlist: Playlist = this.playlistForm.value;
      
      this.playlistService.createPlaylist(playlist).subscribe({
        next: (response) => {
          this.submitting = false;
          alert('Lista de reproducción creada exitosamente');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.submitting = false;
          this.error = error.message;
          console.error('Error creando playlist:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.playlistForm);
    }
  }

  resetForm(): void {
    if (confirm('¿Estás seguro de que quieres limpiar el formulario?')) {
      this.playlistForm.reset();
      this.songs.clear();
      this.error = null;
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }
}