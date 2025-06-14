import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ChatComponent } from './chat/chat.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ConversationComponent } from './conversation/conversation.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/layout', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'layout',
    component: LayoutComponent,
    canActivate: [AuthGuard], // <-- protège l'accès à /layout et ses enfants
    children: [
      { path: '', component: HomeComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'conversation/:email', component: ConversationComponent },
    ]
  }
];