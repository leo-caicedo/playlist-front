import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Playlist, PlaylistResponse } from '../models/playlist.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private baseUrl = 'http://localhost:8080/api/v1/lists';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('admin:admin123')
    })
  };

  constructor(private http: HttpClient) {}

  getAllPlaylists(): Observable<PlaylistResponse[]> {
    return this.http.get<PlaylistResponse[]>(this.baseUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPlaylistByName(nombre: string): Observable<PlaylistResponse> {
    const url = `${this.baseUrl}/${encodeURIComponent(nombre)}`;
    return this.http.get<PlaylistResponse>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  createPlaylist(playlist: Playlist): Observable<PlaylistResponse> {
    return this.http.post<PlaylistResponse>(this.baseUrl, playlist, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deletePlaylist(nombre: string): Observable<any> {
    const url = `${this.baseUrl}/${encodeURIComponent(nombre)}`;
    return this.http.delete(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta - Datos inválidos';
          break;
        case 401:
          errorMessage = 'No autorizado - Credenciales inválidas';
          break;
        case 404:
          errorMessage = 'Lista no encontrada';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Error en PlaylistService:', error);
    return throwError(() => new Error(errorMessage));
  }
}