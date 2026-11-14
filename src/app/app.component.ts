import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    <footer class="app-footer">
      <div class="container footer-content">
        <p>&copy; 2026 DriveEasy - Plateforme de location de véhicules (SESAME LIM3 B/C)</p>
        <p class="text-secondary"><small>Conçu avec Spring Cloud & Angular (Standalone Components)</small></p>
      </div>
    </footer>
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - 140px);
      padding-bottom: 2rem;
    }
    .app-footer {
      background: white;
      border-top: 1px solid var(--gray-200);
      padding: 1.25rem 0;
      text-align: center;
      font-size: 0.85rem;
    }
    .footer-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
  `]
})
export class AppComponent {}
