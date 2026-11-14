import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { LocationService } from '../../../core/services/location.service';
import { Client, Eligibilite } from '../../../core/models/client.model';
import { Location } from '../../../core/models/location.model';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container" *ngIf="client">
      <div class="breadcrumb">
        <a routerLink="/clients"><i class="fa-solid fa-arrow-left"></i> Retour à la liste des clients</a>
      </div>

      <div class="client-header-card card">
        <div class="header-left">
          <div class="avatar">
            <i class="fa-solid fa-user"></i>
          </div>
          <div>
            <h1 class="page-title">{{ client.prenom }} {{ client.nom }}</h1>
            <p class="text-secondary"><i class="fa-solid fa-id-badge"></i> CIN : <code>{{ client.cin }}</code> | Client depuis : {{ client.dateInscription || '2024' }}</p>
          </div>
        </div>
        <div>
          <span class="badge" [ngClass]="'badge-' + client.categorieClient.toLowerCase()">
            <i class="fa-solid fa-crown"></i> {{ client.categorieClient }}
          </span>
        </div>
      </div>

      <!-- Eligibility Banner -->
      <div class="eligibility-banner" [ngClass]="eligibilite?.eligible ? 'banner-success' : 'banner-danger'" *ngIf="eligibilite">
        <div class="banner-icon">
          <i class="fa-solid" [ngClass]="eligibilite!.eligible ? 'fa-circle-check' : 'fa-circle-xmark'"></i>
        </div>
        <div class="banner-content">
          <h4>{{ eligibilite!.eligible ? 'Client Éligible à la Location' : 'Client Inéligible à la Location' }}</h4>
          <p>{{ eligibilite!.motif }}</p>
          <div class="criteria-row">
            <span><i class="fa-solid fa-check"></i> Âge : <strong>{{ eligibilite!.age }} ans</strong> (Requis : ≥ 21)</span>
            <span><i class="fa-solid fa-check"></i> Permis : <strong>{{ eligibilite!.permisValide ? 'En cours de validité' : 'Expiré' }}</strong></span>
          </div>
        </div>
      </div>

      <!-- Information Details & History -->
      <div class="detail-grid">
        <div class="card">
          <h2 class="section-title"><i class="fa-solid fa-address-card text-primary"></i> Coordonnées & Documents</h2>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Email</span>
              <span class="info-val">{{ client.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Téléphone</span>
              <span class="info-val">{{ client.telephone }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Adresse</span>
              <span class="info-val">{{ client.adresse }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Numéro de Permis</span>
              <span class="info-val font-mono">{{ client.numeroPermis }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date Expiration Permis</span>
              <span class="info-val">{{ client.dateExpirationPermis }}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="section-title"><i class="fa-solid fa-clock-rotate-left text-primary"></i> Historique des Locations</h2>
          <div *ngIf="locations.length > 0; else noLocations">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Réf</th>
                    <th>Période</th>
                    <th>Montant</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let loc of locations">
                    <td><code>#{{ loc.id }}</code></td>
                    <td>{{ loc.dateDebut }} &rarr; {{ loc.dateFinPrevue }}</td>
                    <td class="font-bold">{{ loc.montantTotal | number:'1.2-2' }} TND</td>
                    <td>
                      <span class="badge" [ngClass]="'badge-' + loc.statut.toLowerCase()">
                        {{ loc.statut }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <ng-template #noLocations>
            <p class="text-secondary">Aucune location enregistrée pour ce client.</p>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .breadcrumb { margin-bottom: 1.25rem; }
    .breadcrumb a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.875rem;
    }
    .client-header-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--primary-light);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    .eligibility-banner {
      display: flex;
      gap: 1.25rem;
      padding: 1.25rem;
      border-radius: var(--radius-md);
      margin-bottom: 1.5rem;
    }
    .banner-success {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #065f46;
    }
    .banner-danger {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #991b1b;
    }
    .banner-icon {
      font-size: 2rem;
    }
    .criteria-row {
      display: flex;
      gap: 2rem;
      margin-top: 0.5rem;
      font-size: 0.85rem;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1.25fr;
      gap: 1.5rem;
    }
    @media (max-width: 900px) {
      .detail-grid { grid-template-columns: 1fr; }
    }
    .section-title {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
    }
    .info-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid var(--gray-200);
      padding-bottom: 0.5rem;
    }
    .info-label {
      color: var(--secondary);
      font-size: 0.875rem;
    }
    .info-val {
      font-weight: 600;
      font-size: 0.875rem;
    }
    .font-mono { font-family: monospace; }
  `]
})
export class ClientDetailComponent implements OnInit {
  client: Client | null = null;
  eligibilite: Eligibilite | null = null;
  locations: Location[] = [];

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.clientService.getById(id).subscribe({
        next: (c) => this.client = c
      });
      this.clientService.checkEligibilite(id).subscribe({
        next: (e) => this.eligibilite = e
      });
      this.locationService.getAll(undefined, id).subscribe({
        next: (locs) => this.locations = locs
      });
    }
  }
}
