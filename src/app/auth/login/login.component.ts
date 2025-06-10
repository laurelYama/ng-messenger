import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form: LoginRequest = {
    email: '',
    password: ''
  };

  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.form).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/contacts']); // Redirection après login
      },
      error: () => {
        this.error = 'Identifiants invalides';
      }
    });
  }
}
