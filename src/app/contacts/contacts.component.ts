import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService } from '../core/services/contact.service';
import { ChatService } from '../core/services/chat.service';
import { Contact } from '../models/contact.model';
import { MessageModel } from '../models/message.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  private refreshInterval: any;
  contacts: Contact[] = [];
  loading = true;
  lastMessages: {
    [key: string]: {
      content: string;
      timestamp: string;
      seen: boolean;
      senderEmail: string;
      isMine: boolean;
    } | undefined
  } = {};
  unreadCounts: { [key: string]: number } = {};
  totalUnread = 0;
  currentUserEmail = '';

  constructor(
    private contactService: ContactService,
    private chatService: ChatService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserEmail = this.getCurrentUserEmail();
    this.loadContacts();

    // Refresh automatique toutes les 5 secondes
    this.refreshInterval = setInterval(() => {
      this.loadContacts();
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  getCurrentUserEmail(): string {
    const token = this.authService.getToken();
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || '';
    } catch {
      return '';
    }
  }

  loadContacts(): void {
    this.contactService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        this.loadLastMessages();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadLastMessages(): void {
    this.totalUnread = 0;
    this.contacts.forEach(contact => {
      this.chatService.getConversation(contact.email).subscribe({
        next: (messages: MessageModel[]) => {
          // Filtrer les messages non lus
          const unreadMessages = messages.filter(msg =>
            msg.receiverEmail === this.currentUserEmail && !msg.seen
          );

          this.unreadCounts[contact.email] = unreadMessages.length;
          this.totalUnread += unreadMessages.length;

          if (messages.length > 0) {
            messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            const lastMessage = messages[0];
            this.lastMessages[contact.email] = {
              content: lastMessage.content.length > 20
                ? lastMessage.content.substring(0, 20) + '...'
                : lastMessage.content,
              timestamp: new Date(lastMessage.timestamp).toLocaleString(),
              seen: lastMessage.seen || lastMessage.senderEmail === this.currentUserEmail,
              senderEmail: lastMessage.senderEmail,
              isMine: lastMessage.senderEmail === this.currentUserEmail
            };
          } else {
            this.lastMessages[contact.email] = {
              content: "Aucun message récent",
              timestamp: "",
              seen: true,
              senderEmail: "",
              isMine: false // Ajouté pour respecter le type
            };
          }
        },
        error: (err) => {
          this.lastMessages[contact.email] = {
            content: "Erreur de chargement",
            timestamp: "",
            seen: true,
            senderEmail: "",
            isMine: false // Ajouté pour respecter le type
          };
        }
      });
    });
  }

  readConversations: { [email: string]: boolean } = {};

viewConversation(contact: Contact): void {
  const contactEmail = contact.email;
  if (this.unreadCounts[contactEmail] > 0) {
    this.totalUnread -= this.unreadCounts[contactEmail];
    this.unreadCounts[contactEmail] = 0;
    if (this.lastMessages[contactEmail]) {
      this.lastMessages[contactEmail]!.seen = true;
    }
  }
  // Marquer comme lu côté front
  this.readConversations[contactEmail] = true;
  this.router.navigate(['/layout/conversation', contact.email]);
}

  markMessagesAsRead(contactId: number): void {
    // Retrouver l'email correspondant à l'id
    const contact = this.contacts.find(c => c.id === contactId);
    if (!contact) return;
    const contactEmail = contact.email;

    if (this.unreadCounts[contactEmail] > 0) {
      this.chatService.markAsSeen(contactId).subscribe({
        next: () => {
          // Mettre à jour le dernier message comme lu
          if (this.lastMessages[contactEmail]) {
            this.lastMessages[contactEmail]!.seen = true;
          }
          // Mettre à jour les compteurs
          this.totalUnread -= this.unreadCounts[contactEmail];
          this.unreadCounts[contactEmail] = 0;
        },
        error: (err) => {
          console.error('Erreur lors du marquage comme lu:', err);
        }
      });
    }
  }

  getAvatarColor(email: string): string {
    // Génère une couleur à partir de l'email
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Convertir le hash en couleur hexadécimale
    const color = '#' + ((hash >> 24) & 0xFF).toString(16).padStart(2, '0') +
                        ((hash >> 16) & 0xFF).toString(16).padStart(2, '0') +
                        ((hash >> 8) & 0xFF).toString(16).padStart(2, '0');
    // Si la couleur est trop claire, on force un peu plus foncé
    return color.length === 7 ? color : '#007bff';
  }
}