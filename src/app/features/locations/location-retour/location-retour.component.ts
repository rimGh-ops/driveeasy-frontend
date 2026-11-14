import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LocationService } from '../../../core/services/location.service';
import { LocationDetail } from '../../../core/models/location.model';

@Component({
  selector: 'app-location-retour',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="retour-wrapper">
        <div class="breadcrumb no-print">
          <a routerLink="/locations"><i class="fa-solid fa-arrow-left"></i> Retour aux locations</a>
        </div>

        <div class="card invoice-card" *ngIf="detail">
          <!-- Invoice Header -->
          <div class="invoice-header">
            <div>
              <h1 class="invoice-brand">Drive<span class="text-primary">Easy</span></h1>
              <p class="text-secondary">Agence de location de véhicules</p>
            </div>
            <div class="invoice-meta">
              <h2>FICHE DE RESTITUTION</h2>
              <p>Dossier N° : <strong>#{{ detail.location.id }}</strong></p>
              <p>Date : <strong>{{ today }}</strong></p>
            </div>
          </div>

          <!-- Parties Info -->
          <div class="parties-grid">
            <div class="party-box">
              <h3>Client Locataire</h3>
              <p><strong>{{ detail.client?.prenom }} {{ detail.client?.nom }}</strong></p>
              <p>CIN : <code>{{ detail.client?.cin }}</code></p>
              <p>Permis : <code>{{ detail.client?.numeroPermis }}</code></p>
              <p>Catégorie : <span class="badge" [ngClass]="'badge-' + (detail.client?.categorieClient || 'standard').toLowerCase()">{{ detail.client?.categorieClient }}</span></p>
            </div>
            <div class="party-box">
              <h3>Véhicule Restitué</h3>
              <p><strong>{{ detail.vehicule?.marque }} {{ detail.vehicule?.modele }}</strong></p>
              <p>Immatriculation : <code>{{ detail.vehicule?.immatriculation }}</code></p>
              <p>Carburant : {{ detail.vehicule?.carburant }}</p>
              <p>Kilométrage au départ : <strong>{{ detail.location.kmDepart | number }} km</strong></p>
            </div>
          </div>

          <!-- Return Input Form (Hidden on Print if Completed) -->
          <div class="card return-form-box no-print" *ngIf="detail.location.statut === 'EN_COURS'">
            <h3><i class="fa-solid fa-gauge text-primary"></i> Enregistrement du Retour</h3>
            <div class="form-group mt-3">
              <label class="form-label">Kilométrage au retour (km) * (≥ {{ detail.location.kmDepart }})</label>
              <input type="number" [(ngModel)]="kmRetour" class="form-control" [min]="detail.location.kmDepart">
            </div>

            <div *ngIf="isLate" class="alert alert-warning mt-3">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <strong>Attention :</strong> Ce véhicule est restitué avec <strong>{{ lateDays }} jour(s) de retard</strong>. Une pénalité de <strong>1.5 × tarif journalier par jour</strong> s'applique automatiquement.
            </div>

            <div *ngIf="errorMessage" class="alert alert-danger mt-3">
              {{ errorMessage }}
            </div>

            <button (click)="submitReturn()" [disabled]="!kmRetour || kmRetour < detail.location.kmDepart || isSubmitting" class="btn btn-success mt-3">
              <i class="fa-solid fa-check"></i> Valider la Restitution et Clôturer
            </button>
          </div>

          <!-- Final Calculation Breakdown -->
          <div class="breakdown-table-wrapper mt-4">
            <table class="table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="text-right">Montant</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Forfait Location de base (Période : {{ detail.location.dateDebut }} au {{ detail.location.dateFinPrevue }})</td>
                  <td class="text-right">{{ detail.location.montantTotal | number:'1.2-2' }} TND</td>
                </tr>
                <tr *ngIf="detail.location.penalite && detail.location.penalite > 0">
                  <td class="text-danger">Pénalités de retard applicables</td>
                  <td class="text-right text-danger font-bold">+{{ detail.location.penalite | number:'1.2-2' }} TND</td>
                </tr>
                <tr class="total-row">
                  <td><strong>TOTAL NET À RÉGLER</strong></td>
                  <td class="text-right total-amount">
                    {{ detail.location.montantTotal | number:'1.2-2' }} TND
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Print & Actions -->
          <div class="invoice-footer no-print">
            <button (click)="printInvoice()" class="btn btn-secondary">
              <i class="fa-solid fa-print"></i> Imprimer le récapitulatif
            </button>
            <a routerLink="/locations" class="btn btn-primary">
              <i class="fa-solid fa-arrow-left"></i> Retour à la liste
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .retour-wrapper {
      max-width: 800px;
      margin: 0 auto;
    }
    .invoice-card {
      padding: 2.5rem;
      background: white;
    }
    .invoice-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid var(--gray-200);
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .invoice-brand {
      font-size: 2rem;
      font-weight: 800;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-meta h2 {
      font-size: 1.25rem;
      color: var(--primary);
    }
    .parties-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .party-box {
      background: var(--gray-100);
      padding: 1.25rem;
      border-radius: var(--radius-sm);
    }
    .party-box h3 {
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
      color: var(--secondary);
      text-transform: uppercase;
      font-weight: 700;
    }
    .party-box p {
      margin-bottom: 0.35rem;
      font-size: 0.875rem;
    }
    .return-form-box {
      background: #f8fafc;
      border: 1px dashed var(--primary);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .text-right { text-align: right; }
    .total-row td {
      font-size: 1.2rem;
      border-top: 2px solid var(--dark);
    }
    .total-amount {
      color: var(--primary);
      font-weight: 800;
    }
    .invoice-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--gray-200);
    }
    .mt-3 { margin-top: 1rem; }
    .mt-4 { margin-top: 1.5rem; }
    .font-bold { font-weight: 700; }

    @media print {
      .no-print { display: none !important; }
      body { background: white; }
      .container { max-width: 100%; padding: 0; }
      .card { border: none; box-shadow: none; padding: 0; }
    }
  `]
})
export class LocationRetourComponent implements OnInit {
  detail: LocationDetail | null = null;
  kmRetour: number | null = null;
  today = new Date().toISOString().split('T')[0];
  isLate = false;
  lateDays = 0;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadDetail(id);
    }
  }

  loadDetail(id: number): void {
    this.locationService.getById(id).subscribe({
      next: (data) => {
        this.detail = data;
        this.kmRetour = data.location.kmRetour || (data.location.kmDepart + 150);

        const fin = new Date(data.location.dateFinPrevue);
        const now = new Date(this.today);
        if (now > fin) {
          this.isLate = true;
          const diffTime = Math.abs(now.getTime() - fin.getTime());
          this.lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
      }
    });
  }

  submitReturn(): void {
    if (!this.detail?.location.id || !this.kmRetour) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    this.locationService.returnLocation(this.detail.location.id, this.kmRetour).subscribe({
      next: (updatedLoc) => {
        this.isSubmitting = false;
        if (this.detail) {
          this.detail.location = updatedLoc;
        }
        alert('Restitution effectuée avec succès !');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Erreur lors du retour.';
      }
    });
  }

  printInvoice(): void {
    window.print();
  }
}
