import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicule, StatutVehicule, Carburant } from '../models/vehicule.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  private readonly baseUrl = 'http://localhost:8080/api/vehicules';

  constructor(private http: HttpClient) {}

  getAll(marque?: string, carburant?: Carburant, statut?: StatutVehicule, prixMax?: number): Observable<Vehicule[]> {
    let params = new HttpParams();
    if (marque) params = params.set('marque', marque);
    if (carburant) params = params.set('carburant', carburant);
    if (statut) params = params.set('statut', statut);
    if (prixMax) params = params.set('prixMax', prixMax.toString());

    return this.http.get<Vehicule[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Vehicule> {
    return this.http.get<Vehicule>(`${this.baseUrl}/${id}`);
  }

  create(vehicule: Vehicule): Observable<Vehicule> {
    return this.http.post<Vehicule>(this.baseUrl, vehicule);
  }

  update(id: number, vehicule: Vehicule): Observable<Vehicule> {
    return this.http.put<Vehicule>(`${this.baseUrl}/${id}`, vehicule);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateStatut(id: number, statut: StatutVehicule): Observable<Vehicule> {
    return this.http.patch<Vehicule>(`${this.baseUrl}/${id}/statut`, { statut });
  }

  getDisponibles(dateDebut?: string, dateFin?: string): Observable<Vehicule[]> {
    let params = new HttpParams();
    if (dateDebut) params = params.set('dateDebut', dateDebut);
    if (dateFin) params = params.set('dateFin', dateFin);
    return this.http.get<Vehicule[]>(`${this.baseUrl}/disponibles`, { params });
  }
}
