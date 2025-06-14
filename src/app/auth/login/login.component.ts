import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, HttpClientModule],
  styleUrls: ['./login.component.css'],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form: LoginRequest = {
    email: '',
    password: ''
  };

  errorMessage: string = '';
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.loading = true;
    this.authService.login(this.form).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/layout']);
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 0) {
          this.errorMessage = "Impossible de contacter le serveur. Vérifiez votre connexion internet.";
        } else if (err.status === 401) {
          this.errorMessage = "Adresse email ou mot de passe incorrect.";
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = "Une erreur inattendue est survenue. Veuillez réessayer.";
        }
        this.loading = false;
      }
    });
  }
}