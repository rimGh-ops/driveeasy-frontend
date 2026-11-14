import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LocationService } from '../../core/services/location.service';
import { Location, StatutLocation } from '../../core/models/location.model';

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="header-section">
        <div>
          <h1 class="page-title">Gestion des Locations</h1>
          <p class="page-subtitle">Pilotez le cycle complet des dossiers : réservation, départ, retour et facturation.</p>
        </div>
        <div>
          <a routerLink="/locations/new" class="btn btn-primary">
            <i class="fa-solid fa-plus"></i> Nouvelle Réservation
          </a>
        </div>
      </div>

      <!-- Filters -->
      <div class="card filter-card">
        <div class="status-filters">
          <button (click)="filterByStatus('')" class="status-tab" [class.active]="currentStatut === ''">
            Toutes
          </button>
          <button (click)="filterByStatus('RESERVEE')" class="status-tab" [class.active]="currentStatut === 'RESERVEE'">
            Réservées
          </button>
          <button (click)="filterByStatus('EN_COURS')" class="status-tab" [class.active]="currentStatut === 'EN_COURS'">
            En Cours
          </button>
          <button (click)="filterByStatus('TERMINEE')" class="status-tab" [class.active]="currentStatut === 'TERMINEE'">
            Terminées
          </button>
          <button (click)="filterByStatus('ANNULEE')" class="status-tab" [class.active]="currentStatut === 'ANNULEE'">
            Annulées
          </button>
        </div>
      </div>

      <!-- Locations Table -->
      <div class="card table-card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Réf</th>
                <th>Client</th>
                <th>Véhicule</th>
                <th>Période Prévue</th>
                <th>Tarif/j</th>
                <th>Montant Total</th>
                <th>Pénalités</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let loc of locations">
                <td><code>#{{ loc.id }}</code></td>
                <td><strong>Client #{{ loc.clientId }}</strong></td>
                <td><span class="badge badge-secondary">Véhicule #{{ loc.vehiculeId }}</span></td>
                <td>
                  <div>Du {{ loc.dateDebut }}</div>
                  <small class="text-secondary">Au {{ loc.dateFinPrevue }}</small>
                </td>
                <td>{{ loc.prixJournalierApplique }} TND</td>
                <td class="font-bold text-primary">{{ loc.montantTotal | number:'1.2-2' }} TND</td>
                <td>
                  <span *ngIf="loc.penalite > 0" class="text-danger font-bold">+{{ loc.penalite | number:'1.2-2' }} TND</span>
                  <span *ngIf="!loc.penalite || loc.penalite === 0" class="text-secondary">-</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + loc.statut.toLowerCase()">
                    {{ loc.statut }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <!-- Action Depart -->
                    <button *ngIf="loc.statut === 'RESERVEE'" (click)="startLocation(loc)" class="btn btn-primary btn-sm" title="Démarrer la location">
                      <i class="fa-solid fa-play"></i> Départ
                    </button>

                    <!-- Action Retour -->
                    <a *ngIf="loc.statut === 'EN_COURS'" [routerLink]="['/locations', loc.id, 'retour']" class="btn btn-success btn-sm" title="Clôturer et retourner">
                      <i class="fa-solid fa-flag-checkered"></i> Retour
                    </a>

                    <!-- Action Annuler -->
                    <button *ngIf="loc.statut === 'RESERVEE'" (click)="cancelLocation(loc)" class="btn btn-danger btn-sm" title="Annuler la réservation">
                      <i class="fa-solid fa-ban"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .filter-card {
      margin-bottom: 1.5rem;
      padding: 0.75rem 1rem;
    }
    .status-filters {
      display: flex;
      gap: 0.5rem;
    }
    .status-tab {
      background: none;
      border: 1px solid var(--gray-200);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 0.85rem;
      color: var(--secondary);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .status-tab:hover {
      background: var(--gray-100);
      color: var(--dark);
    }
    .status-tab.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }
    .table-card {
      padding: 0;
      overflow: hidden;
    }
    .action-buttons {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .badge-secondary {
      background: #f1f5f9;
      color: #334155;
    }
    .font-bold { font-weight: 700; }
  `]
})
export class LocationListComponent implements OnInit {
  locations: Location[] = [];
  currentStatut = '';

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    const s = this.currentStatut ? this.currentStatut as StatutLocation : undefined;
    this.locationService.getAll(s).subscribe({
      next: (data) => this.locations = data
    });
  }

  filterByStatus(statut: string): void {
    this.currentStatut = statut;
    this.loadLocations();
  }

  startLocation(loc: Location): void {
    if (confirm(`Confirmez-vous le départ de la location #${loc.id} ? Le véhicule passera au statut LOUÉ.`)) {
      if (loc.id) {
        this.locationService.startLocation(loc.id).subscribe({
          next: () => this.loadLocations(),
          error: (err) => alert('Erreur : ' + (err.error?.message || err.message))
        });
      }
    }
  }

  cancelLocation(loc: Location): void {
    if (confirm(`Confirmez-vous l'annulation de la réservation #${loc.id} ?`)) {
      if (loc.id) {
        this.locationService.cancelLocation(loc.id).subscribe({
          next: () => this.loadLocations(),
          error: (err) => alert('Erreur : ' + (err.error?.message || err.message))
        });
      }
    }
  }
}
