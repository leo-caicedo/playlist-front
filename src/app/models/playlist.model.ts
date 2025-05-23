export interface Song {
  titulo: string;
  artista: string;
  album: string;
  anno: string;
  genero: string;
}

export interface Playlist {
  nombre: string;
  descripcion: string;
  canciones: Song[];
}

export interface PlaylistResponse {
  nombre: string;
  descripcion: string;
  canciones: Song[];
}