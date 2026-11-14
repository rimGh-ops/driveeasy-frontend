import { Vehicule } from './vehicule.model';
import { Client } from './client.model';

export type StatutLocation = 'RESERVEE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE';

export interface Location {
  id?: number;
  clientId: number;
  vehiculeId: number;
  dateDebut: string;
  dateFinPrevue: string;
  dateRetourEffectif?: string;
  kmDepart: number;
  kmRetour?: number;
  prixJournalierApplique: number;
  montantTotal: number;
  penalite: number;
  statut: StatutLocation;
  dateCreation?: string;
}

export interface LocationDetail {
  location: Location;
  client: Client;
  vehicule: Vehicule;
}

export interface SimulationRequest {
  clientId: number;
  vehiculeId: number;
  dateDebut: string;
  dateFinPrevue: string;
}

export interface SimulationResponse {
  nombreJours: number;
  prixJournalier: number;
  categorieClient: string;
  tauxRemise: number;
  montantBrut: number;
  montantRemise: number;
  montantTotalEstime: number;
}
