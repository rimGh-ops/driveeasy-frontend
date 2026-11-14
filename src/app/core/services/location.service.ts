import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location, LocationDetail, StatutLocation, SimulationRequest, SimulationResponse } from '../models/location.model';
import { Statistiques } from '../models/statistiques.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly baseUrl = 'http://localhost:8080/api/locations';

  constructor(private http: HttpClient) {}

  getAll(statut?: StatutLocation, clientId?: number, vehiculeId?: number, dateDebut?: string, dateFin?: string): Observable<Location[]> {
    let params = new HttpParams();
    if (statut) params = params.set('statut', statut);
    if (clientId) params = params.set('clientId', clientId.toString());
    if (vehiculeId) params = params.set('vehiculeId', vehiculeId.toString());
    if (dateDebut) params = params.set('dateDebut', dateDebut);
    if (dateFin) params = params.set('dateFin', dateFin);

    return this.http.get<Location[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<LocationDetail> {
    return this.http.get<LocationDetail>(`${this.baseUrl}/${id}`);
  }

  create(location: { clientId: number; vehiculeId: number; dateDebut: string; dateFinPrevue: string }): Observable<Location> {
    return this.http.post<Location>(this.baseUrl, location);
  }

  simulatePrice(req: SimulationRequest): Observable<SimulationResponse> {
    return this.http.post<SimulationResponse>(`${this.baseUrl}/simulation`, req);
  }

  startLocation(id: number): Observable<Location> {
    return this.http.patch<Location>(`${this.baseUrl}/${id}/depart`, {});
  }

  returnLocation(id: number, kmRetour?: number): Observable<Location> {
    return this.http.patch<Location>(`${this.baseUrl}/${id}/retour`, { kmRetour });
  }

  cancelLocation(id: number): Observable<Location> {
    return this.http.patch<Location>(`${this.baseUrl}/${id}/annulation`, {});
  }

  getStatistiques(): Observable<Statistiques> {
    return this.http.get<Statistiques>(`${this.baseUrl}/statistiques`);
  }
}
