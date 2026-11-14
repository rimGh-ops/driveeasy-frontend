import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../core/models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="header-section">
        <div>
          <h1 class="page-title">Gestion de la Clientèle</h1>
          <p class="page-subtitle">Consultez les clients, contrôlez la validité de leurs permis et suivez leur statut de fidélité.</p>
        </div>
        <div>
          <button (click)="openCreateModal()" class="btn btn-primary">
            <i class="fa-solid fa-user-plus"></i> Nouveau Client
          </button>
        </div>
      </div>

      <!-- Search bar -->
      <div class="card search-card">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input type="text" [(ngModel)]="searchQuery" (input)="onSearch()" class="form-control search-input" placeholder="Rechercher par nom, prénom, CIN ou email...">
        </div>
      </div>

      <!-- Clients Table -->
      <div class="card table-card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Client</th>
                <th>CIN</th>
                <th>Contact</th>
                <th>Permis de Conduire</th>
                <th>Catégorie</th>
                <th>Statut Permis</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of clients">
                <td>
                  <div class="client-name-cell">
                    <strong>{{ c.prenom }} {{ c.nom }}</strong>
                    <small class="text-secondary">Né(e) le {{ c.dateNaissance }}</small>
                  </div>
                </td>
                <td><code>{{ c.cin }}</code></td>
                <td>
                  <div>{{ c.email }}</div>
                  <small class="text-secondary">{{ c.telephone }}</small>
                </td>
                <td>
                  <div><code>{{ c.numeroPermis }}</code></div>
                  <small>Exp: {{ c.dateExpirationPermis }}</small>
                </td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + c.categorieClient.toLowerCase()">
                    {{ c.categorieClient }}
                  </span>
                </td>
                <td>
                  <span *ngIf="isPermisExpired(c.dateExpirationPermis)" class="badge badge-danger">
                    <i class="fa-solid fa-triangle-exclamation"></i> Expiré !
                  </span>
                  <span *ngIf="!isPermisExpired(c.dateExpirationPermis)" class="badge badge-standard">
                    <i class="fa-solid fa-circle-check"></i> Valide
                  </span>
                </td>
                <td>
                  <a [routerLink]="['/clients', c.id]" class="btn btn-secondary btn-sm">
                    <i class="fa-solid fa-eye"></i> Fiche
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Creation Rapide -->
      <div class="modal-backdrop" *ngIf="showModal">
        <div class="modal-content card">
          <div class="modal-header">
            <h3>Nouveau Client</h3>
            <button class="close-btn" (click)="showModal = false">&times;</button>
          </div>
          <form (ngSubmit)="saveNewClient()">
            <div class="modal-form-grid">
              <div class="form-group">
                <label class="form-label">CIN *</label>
                <input type="text" [(ngModel)]="newClient.cin" name="cin" required class="form-control" placeholder="08123456">
              </div>
              <div class="form-group">
                <label class="form-label">Prénom *</label>
                <input type="text" [(ngModel)]="newClient.prenom" name="prenom" required class="form-control">
              </div>
              <div class="form-group">
                <label class="form-label">Nom *</label>
                <input type="text" [(ngModel)]="newClient.nom" name="nom" required class="form-control">
              </div>
              <div class="form-group">
                <label class="form-label">Date de Naissance *</label>
                <input type="date" [(ngModel)]="newClient.dateNaissance" name="dateNaissance" required class="form-control">
              </div>
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input type="email" [(ngModel)]="newClient.email" name="email" required class="form-control">
              </div>
              <div class="form-group">
                <label class="form-label">Téléphone *</label>
                <input type="text" [(ngModel)]="newClient.telephone" name="telephone" required class="form-control">
              </div>
              <div class="form-group">
                <label class="form-label">Numéro de Permis *</label>
                <input type="text" [(ngModel)]="newClient.numeroPermis" name="numeroPermis" required class="form-control">
              </div>
              <div class="form-group">
                <label class="form-label">Date Expiration Permis *</label>
                <input type="date" [(ngModel)]="newClient.dateExpirationPermis" name="dateExpirationPermis" required class="form-control">
              </div>
              <div class="form-group full-width">
                <label class="form-label">Adresse *</label>
                <input type="text" [(ngModel)]="newClient.adresse" name="adresse" required class="form-control">
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" (click)="showModal = false" class="btn btn-secondary">Annuler</button>
              <button type="submit" class="btn btn-primary">Créer le client</button>
            </div>
          </form>
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
    .search-card {
      margin-bottom: 1.5rem;
      padding: 1rem;
    }
    .search-box {
      display: flex;
      align-items: center;
      position: relative;
    }
    .search-icon {
      position: absolute;
      left: 14px;
      color: var(--secondary);
    }
    .search-input {
      padding-left: 2.5rem;
    }
    .table-card {
      padding: 0;
      overflow: hidden;
    }
    .client-name-cell {
      display: flex;
      flex-direction: column;
    }
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      width: 90%;
      max-width: 650px;
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--gray-200);
      padding-bottom: 0.75rem;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
    .modal-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .full-width { grid-column: 1 / -1; }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--gray-200);
    }
  `]
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  searchQuery = '';
  showModal = false;

  newClient: Client = {
    cin: '',
    nom: '',
    prenom: '',
    dateNaissance: '1995-01-01',
    email: '',
    telephone: '+216 ',
    adresse: '',
    numeroPermis: '',
    dateExpirationPermis: '2028-01-01',
    categorieClient: 'STANDARD'
  };

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAll(this.searchQuery).subscribe({
      next: (data) => this.clients = data
    });
  }

  onSearch(): void {
    this.loadClients();
  }

  isPermisExpired(dateExp: string): boolean {
    if (!dateExp) return false;
    return new Date(dateExp) < new Date();
  }

  openCreateModal(): void {
    this.showModal = true;
  }

  saveNewClient(): void {
    this.clientService.create(this.newClient).subscribe({
      next: () => {
        this.showModal = false;
        this.loadClients();
      },
      error: (err) => alert('Erreur : ' + (err.error?.message || err.message))
    });
  }
}
