// src/app/services/web-socket.service.ts
import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, Message } from '@stomp/stompjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;

  constructor(private authService: AuthService) {
    this.stompClient = new Client({
      brokerURL: undefined, // utilise SockJS à la place du WebSocket natif
      webSocketFactory: () =>
        new SockJS(`${environment.apiUrl}/ws`),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      connectHeaders: {
        Authorization: `Bearer ${this.authService.getToken() || ''}`
      }
    });

    this.stompClient.onConnect = () => {
      console.log('WebSocket connecté');
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Erreur STOMP:', frame.headers['message']);
    };

    this.stompClient.activate();
  }

  /**
   * S’abonner aux messages privés pour l’utilisateur donné
   */
  subscribeToPrivateMessages(userEmail: string, callback: (message: Message) => void) {
    if (!this.stompClient.connected) {
      console.warn('STOMP non connecté, abonnement en attente...');
    }
    this.stompClient.subscribe(`/queue/${userEmail}`, callback);
  }

  /**
   * Envoyer un message via WebSocket
   */
  sendMessage(destination: string, body: any) {
    if (!this.stompClient.connected) {
      console.warn('WebSocket non connecté, impossible d’envoyer le message.');
      return;
    }

    this.stompClient.publish({
      destination: destination,
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${this.authService.getToken() || ''}`
      }
    });
  }

  /**
   * Se déconnecter proprement
   */
  disconnect() {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
      console.log('WebSocket déconnecté');
    }
  }

  /**
   * Forcer la reconnexion (ex: après login/logout)
   */
  reconnect() {
    this.disconnect();
    this.stompClient.activate();
  }
}
