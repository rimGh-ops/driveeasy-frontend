import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VehiculeService } from '../../core/services/vehicule.service';
import { Vehicule, Carburant, StatutVehicule } from '../../core/models/vehicule.model';

@Component({
  selector: 'app-vehicule-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="header-section">
        <div>
          <h1 class="page-title">Catalogue des Véhicules</h1>
          <p class="page-subtitle">Gérez et suivez le parc automobile de votre agence.</p>
        </div>
        <div>
          <a routerLink="/vehicules/new" class="btn btn-primary">
            <i class="fa-solid fa-plus"></i> Ajouter un Véhicule
          </a>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="card filter-card">
        <div class="filter-grid">
          <div class="form-group mb-0">
            <label class="form-label">Recherche</label>
            <input type="text" [(ngModel)]="searchMarque" (input)="applyFilters()" class="form-control" placeholder="Marque ou modèle...">
          </div>
          <div class="form-group mb-0">
            <label class="form-label">Carburant</label>
            <select [(ngModel)]="selectedCarburant" (change)="applyFilters()" class="form-select">
              <option value="">Tous les carburants</option>
              <option value="ESSENCE">Essence</option>
              <option value="DIESEL">Diesel</option>
              <option value="HYBRIDE">Hybride</option>
              <option value="ELECTRIQUE">Électrique</option>
            </select>
          </div>
          <div class="form-group mb-0">
            <label class="form-label">Statut</label>
            <select [(ngModel)]="selectedStatut" (change)="applyFilters()" class="form-select">
              <option value="">Tous les statuts</option>
              <option value="DISPONIBLE">Disponible</option>
              <option value="LOUE">Loué</option>
              <option value="MAINTENANCE">En Maintenance</option>
            </select>
          </div>
          <div class="form-group mb-0">
            <label class="form-label">Prix max / jour (TND)</label>
            <input type="number" [(ngModel)]="prixMax" (input)="applyFilters()" class="form-control" placeholder="Ex: 200">
          </div>
        </div>
      </div>

      <!-- Grid of Vehicle Cards -->
      <div class="vehicules-grid" *ngIf="filteredVehicules.length > 0; else noVehicles">
        <div class="card vehicule-card" *ngFor="let v of filteredVehicules">
          <div class="vehicule-image-wrapper">
            <img [src]="v.imageUrl || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800'" [alt]="v.marque + ' ' + v.modele" class="vehicule-image">
            <span class="badge status-badge" [ngClass]="'badge-' + v.statut.toLowerCase()">
              {{ v.statut }}
            </span>
          </div>

          <div class="vehicule-body">
            <div class="vehicule-title-row">
              <h3 class="vehicule-title">{{ v.marque }} {{ v.modele }}</h3>
              <span class="vehicule-price">{{ v.prixJournalier }} <small>TND/j</small></span>
            </div>
            <div class="immatriculation-tag">
              <i class="fa-solid fa-id-card"></i> {{ v.immatriculation }}
            </div>

            <div class="specs-grid">
              <div class="spec-item"><i class="fa-solid fa-calendar"></i> {{ v.annee }}</div>
              <div class="spec-item"><i class="fa-solid fa-gas-pump"></i> {{ v.carburant }}</div>
              <div class="spec-item"><i class="fa-solid fa-gear"></i> {{ v.boite }}</div>
              <div class="spec-item"><i class="fa-solid fa-users"></i> {{ v.nbPlaces }} places</div>
              <div class="spec-item"><i class="fa-solid fa-gauge"></i> {{ v.kilometrage | number }} km</div>
              <div class="spec-item"><i class="fa-solid fa-palette"></i> {{ v.couleur }}</div>
            </div>

            <div class="card-actions">
              <a [routerLink]="['/vehicules', v.id, 'edit']" class="btn btn-secondary btn-sm">
                <i class="fa-solid fa-pen-to-square"></i> Modifier
              </a>
              <button (click)="deleteVehicule(v)" class="btn btn-danger btn-sm" [disabled]="v.statut === 'LOUE'">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noVehicles>
        <div class="card empty-card">
          <i class="fa-solid fa-car-tunnel empty-icon"></i>
          <h3>Aucun véhicule correspondant aux filtres</h3>
          <p class="text-secondary">Ajustez vos critères de recherche ou réinitialisez les filtres.</p>
          <button (click)="resetFilters()" class="btn btn-secondary mt-3">Réinitialiser les filtres</button>
        </div>
      </ng-template>
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
      margin-bottom: 2rem;
      padding: 1.25rem;
    }
    .filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      align-items: end;
    }
    .mb-0 { margin-bottom: 0; }
    .vehicules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .vehicule-card {
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .vehicule-image-wrapper {
      position: relative;
      height: 200px;
      overflow: hidden;
      background: #e2e8f0;
    }
    .vehicule-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .vehicule-card:hover .vehicule-image {
      transform: scale(1.05);
    }
    .status-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      backdrop-filter: blur(4px);
    }
    .vehicule-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .vehicule-title-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.35rem;
    }
    .vehicule-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--dark);
    }
    .vehicule-price {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--primary);
    }
    .vehicule-price small {
      font-size: 0.75rem;
      color: var(--secondary);
    }
    .immatriculation-tag {
      font-family: monospace;
      font-size: 0.85rem;
      color: var(--gray-600);
      background: var(--gray-100);
      display: inline-block;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      border: 1px solid var(--gray-200);
    }
    .specs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
      font-size: 0.8rem;
      color: var(--gray-600);
    }
    .spec-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .card-actions {
      display: flex;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid var(--gray-200);
    }
    .empty-card {
      text-align: center;
      padding: 3rem 1rem;
    }
    .empty-icon {
      font-size: 3rem;
      color: var(--gray-300);
      margin-bottom: 1rem;
    }
    .mt-3 { margin-top: 1rem; }
  `]
})
export class VehiculeListComponent implements OnInit {
  vehicules: Vehicule[] = [];
  filteredVehicules: Vehicule[] = [];

  searchMarque = '';
  selectedCarburant = '';
  selectedStatut = '';
  prixMax: number | null = null;

  constructor(private vehiculeService: VehiculeService) {}

  ngOnInit(): void {
    this.loadVehicules();
  }

  loadVehicules(): void {
    this.vehiculeService.getAll().subscribe({
      next: (data) => {
        this.vehicules = data;
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    this.filteredVehicules = this.vehicules.filter(v => {
      const matchMarque = !this.searchMarque ||
        v.marque.toLowerCase().includes(this.searchMarque.toLowerCase()) ||
        v.modele.toLowerCase().includes(this.searchMarque.toLowerCase());

      const matchCarburant = !this.selectedCarburant || v.carburant === this.selectedCarburant;
      const matchStatut = !this.selectedStatut || v.statut === this.selectedStatut;
      const matchPrix = !this.prixMax || v.prixJournalier <= this.prixMax;

      return matchMarque && matchCarburant && matchStatut && matchPrix;
    });
  }

  resetFilters(): void {
    this.searchMarque = '';
    this.selectedCarburant = '';
    this.selectedStatut = '';
    this.prixMax = null;
    this.applyFilters();
  }

  deleteVehicule(v: Vehicule): void {
    if (v.statut === 'LOUE') {
      alert('Impossible de supprimer un véhicule actuellement loué !');
      return;
    }
    if (confirm(`Confirmez-vous la suppression du véhicule ${v.marque} ${v.modele} (${v.immatriculation}) ?`)) {
      if (v.id) {
        this.vehiculeService.delete(v.id).subscribe({
          next: () => this.loadVehicules(),
          error: (err) => alert('Erreur lors de la suppression : ' + (err.error?.message || err.message))
        });
      }
    }
  }
}
