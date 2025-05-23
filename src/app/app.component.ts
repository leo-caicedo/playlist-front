import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule], // Agregado RouterLinkActive
  template: `
    <div class="app-container">
      <header class="app-header">
        <nav class="navbar">
          <div class="nav-brand">
            <a routerLink="/" class="brand-link">
              🎵 Playlist Manager
            </a>
          </div>
          <div class="nav-links">
            <a routerLink="/" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              Inicio
            </a>
            <a routerLink="/create" class="nav-link" routerLinkActive="active">
              Crear Lista
            </a>
          </div>
        </nav>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="app-footer">
        <p>&copy; 2024 Playlist Manager - Gestiona tus listas de reproducción</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f5f5f5;
    }

    .app-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      height: 70px;
    }

    .nav-brand .brand-link {
      font-size: 1.8em;
      font-weight: bold;
      color: white;
      text-decoration: none;
      transition: opacity 0.2s;
    }

    .nav-brand .brand-link:hover {
      opacity: 0.8;
    }

    .nav-links {
      display: flex;
      gap: 30px;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 20px;
      transition: all 0.2s;
      position: relative;
    }

    .nav-link:hover {
      background-color: rgba(255,255,255,0.1);
      transform: translateY(-2px);
    }

    .nav-link.active {
      background-color: rgba(255,255,255,0.2);
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .main-content {
      flex: 1;
      padding: 0;
      margin: 0;
    }

    .app-footer {
      background-color: #343a40;
      color: white;
      text-align: center;
      padding: 20px;
      margin-top: auto;
    }

    .app-footer p {
      margin: 0;
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        height: auto;
        padding: 15px 20px;
        gap: 15px;
      }

      .nav-links {
        gap: 20px;
      }

      .nav-brand .brand-link {
        font-size: 1.5em;
      }
    }

    @media (max-width: 480px) {
      .nav-links {
        flex-direction: column;
        gap: 10px;
        text-align: center;
      }
      
      .navbar {
        padding: 15px;
      }
    }
  `]
})
export class AppComponent {
  title = 'playlist-frontend';
}