import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../core/services/chat.service';
import { MessageModel } from '../models/message.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { ContactService } from '../core/services/contact.service';
import { Contact } from '../models/contact.model';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./conversation.component.css'],
  templateUrl: './conversation.component.html'
})
export class ConversationComponent implements OnInit, OnDestroy {
  messages: MessageModel[] = [];
  contactEmail = '';
  messageContent = '';
  currentUserEmail = '';
  contact: Contact | null = null;
  private refreshInterval: any;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    // Récupère l'email de l'utilisateur connecté
    this.currentUserEmail = this.getCurrentUserEmail();

    this.route.paramMap.subscribe(params => {
      this.contactEmail = params.get('email') || '';
      if (this.contactEmail) {
        this.loadContact();
        this.loadConversation();
        // Rafraîchit la conversation toutes les 40 secondes
        this.refreshInterval = setInterval(() => this.loadConversation(), 40000);
      }
    });
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

  loadContact(): void {
    this.contactService.getContacts().subscribe({
      next: (contacts) => {
        this.contact = contacts.find(c => c.email === this.contactEmail) || null;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du contact:', err);
        this.contact = null;
      }
    });
  }

  loadConversation(): void {
    this.chatService.getConversation(this.contactEmail).subscribe({
      next: (msgs) => this.messages = msgs,
      error: (err) => console.error('Erreur chargement conversation', err)
    });
  }

  sendMessage(): void {
    if (!this.messageContent.trim()) return;
    this.chatService.sendMessage({
      receiverEmail: this.contactEmail,
      content: this.messageContent.trim()
    }).subscribe({
      next: () => {
        this.messageContent = '';
        this.loadConversation();
      },
      error: (err) => alert('Erreur lors de l\'envoi du message')
    });
  }
}