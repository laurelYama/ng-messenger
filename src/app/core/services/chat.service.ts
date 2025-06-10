import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MessageModel } from '../../models/message.model';
import { SendMessagePayload } from '../../models/send-message-payload.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service'; // Import du AuthService pour une gestion propre du token
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Génère les headers d’authentification à partir du token stocké
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Envoyer un message à un utilisateur
   * @param message objet contenant receiverEmail et content
   */
  sendMessage(message: SendMessagePayload): Observable<void> {
  const params = new HttpParams()
    .set('receiverEmail', message.receiverEmail)
    .set('content', message.content);

  return this.http.post<void>(`${this.apiUrl}/send-message`, null, { 
    headers: this.getAuthHeaders(),
    params 
  });
}


  /**
   * Récupérer une conversation avec un autre utilisateur
   * @param user2 adresse email de l'autre utilisateur
   */
  getConversation(user2: string): Observable<MessageModel[]> {
    return this.http.get<MessageModel[]>(
      `${this.apiUrl}/conversation?user2=${encodeURIComponent(user2)}`,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Récupérer les messages non lus de l’utilisateur connecté
   */
  getUnreadMessages(): Observable<MessageModel[]> {
    return this.http.get<MessageModel[]>(
      `${this.apiUrl}/unread`,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Marquer un message comme lu (vu)
   * @param id identifiant du message à marquer comme vu
   */
  markAsSeen(id: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${id}/seen`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
}
