import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../../models/contact.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contacts`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Obtenir la liste des contacts
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  // Ajouter un contact
  addContact(contactEmail: string): Observable<any> {
  const url = `${this.apiUrl}/add`; // URL de l'endpoint
  const body = { contactEmail }; // Corps de la requête
  return this.http.post(url, body, {
    headers: this.getAuthHeaders(),
  });
}

}
