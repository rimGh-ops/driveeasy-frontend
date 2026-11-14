import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VehiculeService } from '../../../core/services/vehicule.service';
import { Vehicule } from '../../../core/models/vehicule.model';

@Component({
  selector: 'app-vehicule-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="form-wrapper">
        <div class="card">
          <div class="form-header">
            <h1 class="page-title">{{ isEditMode ? 'Modifier le Véhicule' : 'Nouveau Véhicule' }}</h1>
            <p class="page-subtitle">Saisissez les caractéristiques techniques et administratives du véhicule.</p>
          </div>

          <div *ngIf="errorMessage" class="alert alert-danger">
            <i class="fa-solid fa-triangle-exclamation"></i> {{ errorMessage }}
          </div>

          <form [formGroup]="vehiculeForm" (ngSubmit)="onSubmit()">
            <div class="form-grid">
              <!-- Immatriculation -->
              <div class="form-group">
                <label class="form-label">Immatriculation *</label>
                <input type="text" formControlName="immatriculation" class="form-control" placeholder="Ex: 210-TN-4521">
                <div *ngIf="f['immatriculation'].touched && f['immatriculation'].invalid" class="text-danger">
                  L'immatriculation est obligatoire.
                </div>
              </div>

              <!-- Marque -->
              <div class="form-group">
                <label class="form-label">Marque *</label>
                <input type="text" formControlName="marque" class="form-control" placeholder="Ex: Volkswagen">
                <div *ngIf="f['marque'].touched && f['marque'].invalid" class="text-danger">
                  La marque est obligatoire.
                </div>
              </div>

              <!-- Modèle -->
              <div class="form-group">
                <label class="form-label">Modèle *</label>
                <input type="text" formControlName="modele" class="form-control" placeholder="Ex: Golf 8">
                <div *ngIf="f['modele'].touched && f['modele'].invalid" class="text-danger">
                  Le modèle est obligatoire.
                </div>
              </div>

              <!-- Année -->
              <div class="form-group">
                <label class="form-label">Année * (≤ {{ currentYear }})</label>
                <input type="number" formControlName="annee" class="form-control" [max]="currentYear">
                <div *ngIf="f['annee'].touched && f['annee'].invalid" class="text-danger">
                  L'année doit être cohérente (≤ {{ currentYear }}).
                </div>
              </div>

              <!-- Couleur -->
              <div class="form-group">
                <label class="form-label">Couleur *</label>
                <input type="text" formControlName="couleur" class="form-control" placeholder="Ex: Gris Nardo">
              </div>

              <!-- Carburant -->
              <div class="form-group">
                <label class="form-label">Carburant *</label>
                <select formControlName="carburant" class="form-select">
                  <option value="ESSENCE">Essence</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="HYBRIDE">Hybride</option>
                  <option value="ELECTRIQUE">Électrique</option>
                </select>
              </div>

              <!-- Boîte -->
              <div class="form-group">
                <label class="form-label">Boîte de vitesses *</label>
                <select formControlName="boite" class="form-select">
                  <option value="MANUELLE">Manuelle</option>
                  <option value="AUTOMATIQUE">Automatique</option>
                </select>
              </div>

              <!-- Nombre de places -->
              <div class="form-group">
                <label class="form-label">Nombre de places *</label>
                <input type="number" formControlName="nbPlaces" class="form-control" min="1" max="9">
              </div>

              <!-- Kilométrage -->
              <div class="form-group">
                <label class="form-label">Kilométrage (km) *</label>
                <input type="number" formControlName="kilometrage" class="form-control" min="0">
              </div>

              <!-- Prix journalier -->
              <div class="form-group">
                <label class="form-label">Prix Journalier (TND) *</label>
                <input type="number" formControlName="prixJournalier" class="form-control" min="0.01" step="0.5">
                <div *ngIf="f['prixJournalier'].touched && f['prixJournalier'].invalid" class="text-danger">
                  Le prix doit être strictement supérieur à 0.
                </div>
              </div>

              <!-- Statut -->
              <div class="form-group">
                <label class="form-label">Statut *</label>
                <select formControlName="statut" class="form-select">
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="LOUE">Loué</option>
                  <option value="MAINTENANCE">En Maintenance</option>
                </select>
              </div>

              <!-- URL Image -->
              <div class="form-group full-width">
                <label class="form-label">URL de l'image</label>
                <input type="text" formControlName="imageUrl" class="form-control" placeholder="https://...">
              </div>
            </div>

            <div class="form-actions">
              <a routerLink="/vehicules" class="btn btn-secondary">Annuler</a>
              <button type="submit" [disabled]="vehiculeForm.invalid || isSubmitting" class="btn btn-primary">
                <i class="fa-solid fa-floppy-disk"></i> {{ isEditMode ? 'Enregistrer les modifications' : 'Créer le véhicule' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-wrapper {
      max-width: 800px;
      margin: 0 auto;
    }
    .form-header {
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--gray-200);
      padding-bottom: 1rem;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    @media (max-width: 650px) {
      .form-grid { grid-template-columns: 1fr; }
    }
    .full-width {
      grid-column: 1 / -1;
    }
    .text-danger {
      color: var(--danger);
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--gray-200);
    }
  `]
})
export class VehiculeFormComponent implements OnInit {
  vehiculeForm!: FormGroup;
  isEditMode = false;
  vehiculeId?: number;
  currentYear = new Date().getFullYear();
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private vehiculeService: VehiculeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get f() { return this.vehiculeForm.controls; }

  ngOnInit(): void {
    this.initForm();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.vehiculeId = Number(idParam);
      this.loadVehicule(this.vehiculeId);
    }
  }

  initForm(): void {
    this.vehiculeForm = this.fb.group({
      immatriculation: ['', [Validators.required]],
      marque: ['', [Validators.required]],
      modele: ['', [Validators.required]],
      annee: [this.currentYear, [Validators.required, Validators.min(1990), Validators.max(this.currentYear)]],
      couleur: ['', [Validators.required]],
      carburant: ['ESSENCE', [Validators.required]],
      boite: ['MANUELLE', [Validators.required]],
      nbPlaces: [5, [Validators.required, Validators.min(1)]],
      kilometrage: [0, [Validators.required, Validators.min(0)]],
      prixJournalier: [100, [Validators.required, Validators.min(0.01)]],
      statut: ['DISPONIBLE', [Validators.required]],
      imageUrl: ['']
    });
  }

  loadVehicule(id: number): void {
    this.vehiculeService.getById(id).subscribe({
      next: (v) => this.vehiculeForm.patchValue(v),
      error: () => this.errorMessage = 'Impossible de charger les données du véhicule.'
    });
  }

  onSubmit(): void {
    if (this.vehiculeForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    const payload: Vehicule = this.vehiculeForm.value;

    const op = this.isEditMode && this.vehiculeId
      ? this.vehiculeService.update(this.vehiculeId, payload)
      : this.vehiculeService.create(payload);

    op.subscribe({
      next: () => this.router.navigate(['/vehicules']),
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la sauvegarde du véhicule.';
      }
    });
  }
}
