import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { VehiculeService } from '../../../core/services/vehicule.service';
import { LocationService } from '../../../core/services/location.service';
import { Client, Eligibilite } from '../../../core/models/client.model';
import { Vehicule } from '../../../core/models/vehicule.model';
import { SimulationResponse } from '../../../core/models/location.model';

@Component({
  selector: 'app-location-new-stepper',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="stepper-wrapper">
        <div class="header-section text-center">
          <h1 class="page-title">Nouvelle Réservation de Véhicule</h1>
          <p class="page-subtitle">Suivez l'assistant pas à pas pour configurer et valider la location.</p>
        </div>

        <!-- Stepper Navigation Bar -->
        <div class="stepper-nav">
          <div class="step-indicator" [class.active]="currentStep === 1" [class.completed]="currentStep > 1">
            <span class="step-num">1</span>
            <span class="step-name">Client</span>
          </div>
          <div class="step-divider"></div>
          <div class="step-indicator" [class.active]="currentStep === 2" [class.completed]="currentStep > 2">
            <span class="step-num">2</span>
            <span class="step-name">Période</span>
          </div>
          <div class="step-divider"></div>
          <div class="step-indicator" [class.active]="currentStep === 3" [class.completed]="currentStep > 3">
            <span class="step-num">3</span>
            <span class="step-name">Véhicule</span>
          </div>
          <div class="step-divider"></div>
          <div class="step-indicator" [class.active]="currentStep === 4" [class.completed]="currentStep > 4">
            <span class="step-num">4</span>
            <span class="step-name">Simulation & Prix</span>
          </div>
          <div class="step-divider"></div>
          <div class="step-indicator" [class.active]="currentStep === 5">
            <span class="step-num">5</span>
            <span class="step-name">Confirmation</span>
          </div>
        </div>

        <!-- Step 1: Select Client -->
        <div class="card step-card" *ngIf="currentStep === 1">
          <h2 class="step-title"><i class="fa-solid fa-user-check text-primary"></i> Étape 1 : Choisir le client locataire</h2>
          <div class="form-group">
            <label class="form-label">Sélectionner un client dans la liste</label>
            <select [(ngModel)]="selectedClientId" (change)="onClientSelected()" class="form-select">
              <option [ngValue]="null" disabled>-- Sélectionnez un client --</option>
              <option *ngFor="let c of clients" [ngValue]="c.id">
                {{ c.prenom }} {{ c.nom }} (CIN: {{ c.cin }}) - {{ c.categorieClient }}
              </option>
            </select>
          </div>

          <!-- Eligibility info box -->
          <div *ngIf="eligibilite" class="alert mt-3" [ngClass]="eligibilite.eligible ? 'alert-success' : 'alert-danger'">
            <i class="fa-solid" [ngClass]="eligibilite.eligible ? 'fa-circle-check' : 'fa-circle-xmark'"></i>
            <div>
              <strong>{{ eligibilite.eligible ? 'Client Éligible' : 'Client Inéligible' }} :</strong> {{ eligibilite.motif }}
            </div>
          </div>

          <div class="step-buttons">
            <a routerLink="/locations" class="btn btn-secondary">Annuler</a>
            <button (click)="goToStep(2)" [disabled]="!selectedClientId || !eligibilite?.eligible" class="btn btn-primary">
              Suivant <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- Step 2: Choose Dates -->
        <div class="card step-card" *ngIf="currentStep === 2">
          <h2 class="step-title"><i class="fa-solid fa-calendar-days text-primary"></i> Étape 2 : Définir la période de location</h2>
          <div class="dates-grid">
            <div class="form-group">
              <label class="form-label">Date de départ (Début) *</label>
              <input type="date" [(ngModel)]="dateDebut" class="form-control" [min]="today">
            </div>
            <div class="form-group">
              <label class="form-label">Date de retour prévue (Fin) *</label>
              <input type="date" [(ngModel)]="dateFinPrevue" class="form-control" [min]="dateDebut || today">
            </div>
          </div>

          <div *ngIf="dateError" class="alert alert-danger mt-3">
            <i class="fa-solid fa-triangle-exclamation"></i> {{ dateError }}
          </div>

          <div class="step-buttons">
            <button (click)="goToStep(1)" class="btn btn-secondary"><i class="fa-solid fa-arrow-left"></i> Précédent</button>
            <button (click)="validateDatesAndGoStep3()" class="btn btn-primary">
              Suivant <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- Step 3: Choose Vehicle -->
        <div class="card step-card" *ngIf="currentStep === 3">
          <h2 class="step-title"><i class="fa-solid fa-car text-primary"></i> Étape 3 : Sélectionner un véhicule disponible</h2>
          <div class="vehicule-selection-grid" *ngIf="disponibles.length > 0; else noVehAvailable">
            <div class="card vehicule-selectable-card"
                 *ngFor="let v of disponibles"
                 [class.selected]="selectedVehiculeId === v.id"
                 (click)="selectVehicule(v)">
              <img [src]="v.imageUrl" class="veh-thumb">
              <div class="veh-info">
                <h4>{{ v.marque }} {{ v.modele }}</h4>
                <div class="immat-badge">{{ v.immatriculation }}</div>
                <div class="veh-meta">{{ v.carburant }} &bull; {{ v.boite }} &bull; {{ v.nbPlaces }} places</div>
                <div class="veh-price">{{ v.prixJournalier }} TND <small>/jour</small></div>
              </div>
            </div>
          </div>

          <ng-template #noVehAvailable>
            <div class="alert alert-warning">
              <i class="fa-solid fa-triangle-exclamation"></i> Aucun véhicule disponible pour la période choisie. Veuillez modifier les dates.
            </div>
          </ng-template>

          <div class="step-buttons">
            <button (click)="goToStep(2)" class="btn btn-secondary"><i class="fa-solid fa-arrow-left"></i> Précédent</button>
            <button (click)="runSimulationAndGoStep4()" [disabled]="!selectedVehiculeId" class="btn btn-primary">
              Simuler le Tarif <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- Step 4: Simulation Preview -->
        <div class="card step-card" *ngIf="currentStep === 4">
          <h2 class="step-title"><i class="fa-solid fa-calculator text-primary"></i> Étape 4 : Simulation financière et Remises</h2>
          <div class="simulation-box" *ngIf="simulation">
            <div class="sim-row">
              <span>Durée de la location</span>
              <strong>{{ simulation.nombreJours }} jour(s)</strong>
            </div>
            <div class="sim-row">
              <span>Tarif de base journalier</span>
              <strong>{{ simulation.prixJournalier | number:'1.2-2' }} TND</strong>
            </div>
            <div class="sim-row">
              <span>Montant brut (Durée × Tarif)</span>
              <strong>{{ simulation.montantBrut | number:'1.2-2' }} TND</strong>
            </div>
            <div class="sim-row discount-row">
              <span>Remise Fidélité (Catégorie : {{ simulation.categorieClient }} - {{ simulation.tauxRemise * 100 }}%)</span>
              <span class="text-success font-bold">- {{ simulation.montantRemise | number:'1.2-2' }} TND</span>
            </div>
            <div class="sim-total-row">
              <span>Total Estimé Net</span>
              <span class="total-amount">{{ simulation.montantTotalEstime | number:'1.2-2' }} TND</span>
            </div>
          </div>

          <div class="step-buttons">
            <button (click)="goToStep(3)" class="btn btn-secondary"><i class="fa-solid fa-arrow-left"></i> Précédent</button>
            <button (click)="goToStep(5)" class="btn btn-primary">
              Confirmer la Réservation <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- Step 5: Confirmation -->
        <div class="card step-card" *ngIf="currentStep === 5">
          <h2 class="step-title"><i class="fa-solid fa-clipboard-check text-primary"></i> Étape 5 : Récapitulatif et Validation</h2>

          <div class="recap-box">
            <p><strong>Client :</strong> {{ selectedClient?.prenom }} {{ selectedClient?.nom }} ({{ selectedClient?.cin }})</p>
            <p><strong>Véhicule :</strong> {{ selectedVehicule?.marque }} {{ selectedVehicule?.modele }} ({{ selectedVehicule?.immatriculation }})</p>
            <p><strong>Période :</strong> Du {{ dateDebut }} au {{ dateFinPrevue }} ({{ simulation?.nombreJours }} jours)</p>
            <p><strong>Montant Total à payer :</strong> <span class="text-primary font-bold">{{ simulation?.montantTotalEstime | number:'1.2-2' }} TND</span></p>
          </div>

          <div *ngIf="saveError" class="alert alert-danger mt-3">
            <i class="fa-solid fa-triangle-exclamation"></i> {{ saveError }}
          </div>

          <div class="step-buttons">
            <button (click)="goToStep(4)" class="btn btn-secondary"><i class="fa-solid fa-arrow-left"></i> Précédent</button>
            <button (click)="submitReservation()" [disabled]="isSubmitting" class="btn btn-success">
              <i class="fa-solid fa-check"></i> Valider et Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stepper-wrapper {
      max-width: 860px;
      margin: 0 auto;
    }
    .text-center { text-align: center; }
    .stepper-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 2rem 0;
      background: white;
      padding: 1rem 1.5rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--gray-200);
    }
    .step-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--secondary);
    }
    .step-num {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--gray-200);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
    }
    .step-name {
      font-weight: 600;
      font-size: 0.85rem;
    }
    .step-indicator.active .step-num {
      background: var(--primary);
      color: white;
    }
    .step-indicator.active .step-name {
      color: var(--primary);
    }
    .step-indicator.completed .step-num {
      background: var(--success);
      color: white;
    }
    .step-divider {
      flex: 1;
      height: 2px;
      background: var(--gray-200);
      margin: 0 0.75rem;
    }
    .step-card {
      padding: 2rem;
    }
    .step-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--gray-200);
      padding-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .dates-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .vehicule-selection-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1rem;
    }
    .vehicule-selectable-card {
      cursor: pointer;
      padding: 0.75rem;
      border: 2px solid var(--gray-200);
      transition: all 0.15s ease;
    }
    .vehicule-selectable-card:hover {
      border-color: var(--primary);
      transform: translateY(-2px);
    }
    .vehicule-selectable-card.selected {
      border-color: var(--primary);
      background: var(--primary-light);
    }
    .veh-thumb {
      width: 100%;
      height: 120px;
      object-fit: cover;
      border-radius: var(--radius-sm);
      margin-bottom: 0.5rem;
    }
    .veh-info h4 {
      font-size: 0.95rem;
      margin-bottom: 0.25rem;
    }
    .immat-badge {
      font-family: monospace;
      font-size: 0.75rem;
      color: var(--gray-600);
    }
    .veh-meta {
      font-size: 0.75rem;
      color: var(--secondary);
      margin: 0.25rem 0;
    }
    .veh-price {
      font-weight: 700;
      color: var(--primary);
    }
    .simulation-box, .recap-box {
      background: var(--gray-100);
      border-radius: var(--radius-sm);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .sim-row {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid var(--gray-200);
      padding-bottom: 0.5rem;
    }
    .sim-total-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-top: 0.5rem;
      font-size: 1.25rem;
      font-weight: 800;
    }
    .total-amount {
      color: var(--primary);
    }
    .step-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--gray-200);
    }
    .mt-3 { margin-top: 1rem; }
    .font-bold { font-weight: 700; }
  `]
})
export class LocationNewStepperComponent implements OnInit {
  currentStep = 1;
  today = new Date().toISOString().split('T')[0];

  clients: Client[] = [];
  selectedClientId: number | null = null;
  selectedClient: Client | null = null;
  eligibilite: Eligibilite | null = null;

  dateDebut = this.today;
  dateFinPrevue = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
  dateError = '';

  disponibles: Vehicule[] = [];
  selectedVehiculeId: number | null = null;
  selectedVehicule: Vehicule | null = null;

  simulation: SimulationResponse | null = null;
  isSubmitting = false;
  saveError = '';

  constructor(
    private clientService: ClientService,
    private vehiculeService: VehiculeService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientService.getAll().subscribe({
      next: (data) => this.clients = data
    });
  }

  onClientSelected(): void {
    if (!this.selectedClientId) return;
    this.selectedClient = this.clients.find(c => c.id === this.selectedClientId) || null;
    this.clientService.checkEligibilite(this.selectedClientId).subscribe({
      next: (e) => this.eligibilite = e
    });
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }

  validateDatesAndGoStep3(): void {
    if (!this.dateDebut || !this.dateFinPrevue) {
      this.dateError = 'Les deux dates sont obligatoires.';
      return;
    }
    if (new Date(this.dateFinPrevue) < new Date(this.dateDebut)) {
      this.dateError = 'La date de retour ne peut pas précéder la date de départ.';
      return;
    }
    this.dateError = '';
    this.vehiculeService.getDisponibles(this.dateDebut, this.dateFinPrevue).subscribe({
      next: (data) => {
        this.disponibles = data;
        this.currentStep = 3;
      }
    });
  }

  selectVehicule(v: Vehicule): void {
    this.selectedVehiculeId = v.id || null;
    this.selectedVehicule = v;
  }

  runSimulationAndGoStep4(): void {
    if (!this.selectedClientId || !this.selectedVehiculeId) return;

    this.locationService.simulatePrice({
      clientId: this.selectedClientId,
      vehiculeId: this.selectedVehiculeId,
      dateDebut: this.dateDebut,
      dateFinPrevue: this.dateFinPrevue
    }).subscribe({
      next: (res) => {
        this.simulation = res;
        this.currentStep = 4;
      }
    });
  }

  submitReservation(): void {
    if (!this.selectedClientId || !this.selectedVehiculeId) return;
    this.isSubmitting = true;
    this.saveError = '';

    this.locationService.create({
      clientId: this.selectedClientId,
      vehiculeId: this.selectedVehiculeId,
      dateDebut: this.dateDebut,
      dateFinPrevue: this.dateFinPrevue
    }).subscribe({
      next: () => {
        this.router.navigate(['/locations']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.saveError = err.error?.message || 'Erreur lors de la validation.';
      }
    });
  }
}
