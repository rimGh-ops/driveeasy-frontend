import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, CategorieClient, Eligibilite } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly baseUrl = 'http://localhost:8080/api/clients';

  constructor(private http: HttpClient) {}

  getAll(search?: string): Observable<Client[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<Client[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  create(client: Client): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, client);
  }

  update(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/${id}`, client);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  checkEligibilite(id: number): Observable<Eligibilite> {
    return this.http.get<Eligibilite>(`${this.baseUrl}/${id}/eligibilite`);
  }

  updateCategorie(id: number, categorie: CategorieClient): Observable<Client> {
    return this.http.patch<Client>(`${this.baseUrl}/${id}/categorie`, { categorie });
  }
}
