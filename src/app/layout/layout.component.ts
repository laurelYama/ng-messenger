import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactsComponent } from '../contacts/contacts.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, ContactsComponent, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  screenWidth: number = window.innerWidth;

  constructor(public router: Router) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
  }

  isContactsPage(): boolean {
    return this.router.url === '/layout/contacts' || this.router.url === '/layout';
  }

  goToChat(): void {
    this.router.navigate(['/layout/chat']);
  }
}