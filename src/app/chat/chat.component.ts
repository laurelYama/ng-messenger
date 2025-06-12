import { Component, OnInit } from '@angular/core';
import { ChatService } from '../core/services/chat.service';
import { AuthService } from '../core/services/auth.service';
import { MessageModel } from '../models/message.model';
import { SendMessagePayload } from '../models/send-message-payload.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  userEmail = ''; // Email du destinataire
  currentUserEmail = ''; // Email de l'utilisateur connecté
  messageContent = '';
  conversation: MessageModel[] = [];

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const tokenData = this.decodeToken(this.authService.getToken());
    if (tokenData?.sub) {
      this.currentUserEmail = tokenData.sub;
    } else {
    }
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  // Affiche la conversation avec un utilisateur
  loadConversation(): void {
    if (!this.userEmail.trim()) {
      return;
    }

    this.chatService.getConversation(this.userEmail).subscribe({
      next: (messages) => {
        this.conversation = messages.map(msg => ({
          ...msg,
          formattedTimestamp: new Date(msg.timestamp).toLocaleString()
        }));
      },
      error: (err) => {
        alert("Erreur lors du chargement de la conversation !");
      },
    });
  }

  // Envoie un message à userEmail
  sendMessage(): void {
    if (!this.messageContent.trim() || !this.userEmail.trim()) {
      alert("Veuillez renseigner un message et un destinataire.");
      return;
    }

    const payload: SendMessagePayload = {
      receiverEmail: this.userEmail.trim(),
      content: this.messageContent.trim()
    };


    this.chatService.sendMessage(payload).subscribe({
      next: () => {
        this.messageContent = '';
        this.loadConversation(); // Recharge les messages
      },
      error: (err) => {
        alert("Erreur lors de l’envoi du message !");
      },
    });
  }

  // Décode un JWT sans bibliothèque externe (utile pour récupérer l'email)
  private decodeToken(token: string | null): any {
    if (!token) {
      return null;
    }
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      return null;
    }
  }
}
