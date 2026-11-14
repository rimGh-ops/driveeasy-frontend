import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="nav-container">
        <a routerLink="/dashboard" class="logo">
          <i class="fa-solid fa-car-side logo-icon"></i>
          <span class="logo-text">Drive<span class="logo-accent">Easy</span></span>
        </a>

        <nav class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <i class="fa-solid fa-chart-pie"></i> Tableau de bord
          </a>
          <a routerLink="/vehicules" routerLinkActive="active" class="nav-item">
            <i class="fa-solid fa-car"></i> Véhicules
          </a>
          <a routerLink="/clients" routerLinkActive="active" class="nav-item">
            <i class="fa-solid fa-users"></i> Clients
          </a>
          <a routerLink="/locations" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <i class="fa-solid fa-file-contract"></i> Locations
          </a>
        </nav>

        <div class="nav-actions">
          <a routerLink="/locations/new" class="btn btn-primary">
            <i class="fa-solid fa-plus"></i> Nouvelle Location
          </a>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: white;
      border-bottom: 1px solid var(--gray-200);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .nav-container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0.85rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--dark);
    }
    .logo-icon {
      color: var(--primary);
      font-size: 1.5rem;
    }
    .logo-accent {
      color: var(--primary);
    }
    .nav-links {
      display: flex;
      gap: 0.5rem;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 0.85rem;
      border-radius: var(--radius-sm);
      color: var(--gray-600);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 600;
      transition: all 0.15s ease;
    }
    .nav-item:hover {
      color: var(--primary);
      background: var(--primary-light);
    }
    .nav-item.active {
      color: var(--primary);
      background: var(--primary-light);
    }
  `]
})
export class NavbarComponent {}
