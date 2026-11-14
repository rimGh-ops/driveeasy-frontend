import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LocationService } from '../../core/services/location.service';
import { VehiculeService } from '../../core/services/vehicule.service';
import { Statistiques } from '../../core/models/statistiques.model';
import { Vehicule } from '../../core/models/vehicule.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="dashboard-header">
        <div>
          <h1 class="page-title">Tableau de bord de l'Agence</h1>
          <p class="page-subtitle">Suivi en temps réel du parc automobile et des indicateurs d'exploitation.</p>
        </div>
        <div>
          <a routerLink="/locations/new" class="btn btn-primary">
            <i class="fa-solid fa-calendar-plus"></i> Réserver un véhicule
          </a>
        </div>
      </div>

      <!-- KPI Cards Grid -->
      <div class="kpi-grid">
        <div class="card kpi-card">
          <div class="kpi-icon bg-blue-subtle text-blue">
            <i class="fa-solid fa-coins"></i>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Chiffre d'affaires (Mois)</span>
            <span class="kpi-value">{{ (stats?.chiffreAffairesMois || 0) | number:'1.2-2' }} <small>TND</small></span>
            <span class="kpi-hint">Total cumulé : {{ (stats?.chiffreAffairesTotal || 0) | number:'1.2-2' }} TND</span>
          </div>
        </div>

        <div class="card kpi-card">
          <div class="kpi-icon bg-green-subtle text-green">
            <i class="fa-solid fa-car-on"></i>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Véhicules Disponibles</span>
            <span class="kpi-value">{{ nbDisponibles }}</span>
            <span class="kpi-hint">Prêts pour location immédiate</span>
          </div>
        </div>

        <div class="card kpi-card">
          <div class="kpi-icon bg-purple-subtle text-purple">
            <i class="fa-solid fa-key"></i>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Locations en Cours</span>
            <span class="kpi-value">{{ stats?.locationsEnCours || 0 }}</span>
            <span class="kpi-hint">{{ stats?.locationsReservees || 0 }} réservations à venir</span>
          </div>
        </div>

        <div class="card kpi-card">
          <div class="kpi-icon bg-orange-subtle text-orange">
            <i class="fa-solid fa-chart-line"></i>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Taux d'occupation du Parc</span>
            <span class="kpi-value">{{ stats?.tauxOccupationParc || 0 }}%</span>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" [style.width.%]="stats?.tauxOccupationParc || 0"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Grid: Fleet breakdown and Top rented vehicles -->
      <div class="details-grid">
        <div class="card">
          <h2 class="section-title"><i class="fa-solid fa-pie-chart text-primary"></i> Répartition du Parc Automobile</h2>
          <div class="fleet-status-list">
            <div class="status-item">
              <div class="status-info">
                <span class="badge badge-disponible"><i class="fa-solid fa-circle-check"></i> DISPONIBLE</span>
                <span class="status-count">{{ nbDisponibles }} véhicules</span>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill bg-success" [style.width.%]="(nbDisponibles / totalVehicules) * 100"></div>
              </div>
            </div>

            <div class="status-item">
              <div class="status-info">
                <span class="badge badge-loue"><i class="fa-solid fa-car-side"></i> LOUÉ</span>
                <span class="status-count">{{ nbLoues }} véhicules</span>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill bg-primary" [style.width.%]="(nbLoues / totalVehicules) * 100"></div>
              </div>
            </div>

            <div class="status-item">
              <div class="status-info">
                <span class="badge badge-maintenance"><i class="fa-solid fa-wrench"></i> EN MAINTENANCE</span>
                <span class="status-count">{{ nbMaintenance }} véhicules</span>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill bg-warning" [style.width.%]="(nbMaintenance / totalVehicules) * 100"></div>
              </div>
            </div>
          </div>

          <div class="mt-4 text-center">
            <a routerLink="/vehicules" class="btn btn-secondary btn-sm">
              <i class="fa-solid fa-list"></i> Consulter l'inventaire complet
            </a>
          </div>
        </div>

        <div class="card">
          <h2 class="section-title"><i class="fa-solid fa-award text-warning"></i> Véhicules les plus Loués (Top Performers)</h2>
          <div *ngIf="stats?.topVehicules && stats!.topVehicules.length > 0; else noTop">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Véhicule</th>
                    <th>Immatriculation</th>
                    <th>Locations</th>
                    <th>Revenus Générés</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let v of stats?.topVehicules">
                    <td><strong>{{ v.marqueModele }}</strong></td>
                    <td><code>{{ v.immatriculation }}</code></td>
                    <td><span class="badge badge-fidele">{{ v.nombreLocations }} fois</span></td>
                    <td class="font-bold text-success">{{ v.revenuGenere | number:'1.2-2' }} TND</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <ng-template #noTop>
            <p class="text-muted">Aucune statistique de rotation pour le moment.</p>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .page-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--dark);
    }
    .page-subtitle {
      color: var(--secondary);
      font-size: 0.95rem;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .kpi-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .kpi-icon {
      width: 54px;
      height: 54px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }
    .bg-blue-subtle { background: #dbeafe; }
    .text-blue { color: #1d4ed8; }
    .bg-green-subtle { background: #dcfce7; }
    .text-green { color: #15803d; }
    .bg-purple-subtle { background: #f3e8ff; }
    .text-purple { color: #7e22ce; }
    .bg-orange-subtle { background: #ffedd5; }
    .text-orange { color: #c2410c; }
    .kpi-content {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .kpi-label {
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--secondary);
    }
    .kpi-value {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--dark);
      margin: 0.2rem 0;
    }
    .kpi-value small {
      font-size: 0.9rem;
      color: var(--secondary);
    }
    .kpi-hint {
      font-size: 0.75rem;
      color: var(--secondary);
    }
    .progress-bar-bg {
      height: 8px;
      background: var(--gray-200);
      border-radius: 999px;
      overflow: hidden;
      margin-top: 0.5rem;
    }
    .progress-bar-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 999px;
      transition: width 0.4s ease;
    }
    .bg-success { background: var(--success); }
    .bg-primary { background: var(--primary); }
    .bg-warning { background: var(--warning); }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1.25fr;
      gap: 1.5rem;
    }
    @media (max-width: 900px) {
      .details-grid { grid-template-columns: 1fr; }
    }
    .section-title {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .fleet-status-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .status-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
    }
    .status-count {
      font-weight: 700;
      font-size: 0.9rem;
    }
    .mt-4 { margin-top: 1.5rem; }
    .text-center { text-align: center; }
    .font-bold { font-weight: 700; }
  `]
})
export class DashboardComponent implements OnInit {
  stats: Statistiques | null = null;
  vehicules: Vehicule[] = [];
  nbDisponibles = 0;
  nbLoues = 0;
  nbMaintenance = 0;
  totalVehicules = 1;

  constructor(
    private locationService: LocationService,
    private vehiculeService: VehiculeService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadVehicules();
  }

  loadStats(): void {
    this.locationService.getStatistiques().subscribe({
      next: (data) => this.stats = data,
      error: () => console.log('Stats offline or loading defaults')
    });
  }

  loadVehicules(): void {
    this.vehiculeService.getAll().subscribe({
      next: (data) => {
        this.vehicules = data;
        this.totalVehicules = Math.max(data.length, 1);
        this.nbDisponibles = data.filter(v => v.statut === 'DISPONIBLE').length;
        this.nbLoues = data.filter(v => v.statut === 'LOUE').length;
        this.nbMaintenance = data.filter(v => v.statut === 'MAINTENANCE').length;
      },
      error: () => {}
    });
  }
}
