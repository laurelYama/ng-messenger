import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  styleUrls: ['./register.component.css'],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  form: RegisterRequest = {
    name: '',
    email: '',
    password: ''
  };

  error: string = '';
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
  this.error = '';
  // Contrôle du mot de passe
  const password = this.form.password;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    this.error = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.";
    return;
  }
  this.loading = true;
  this.authService.register(this.form).subscribe({
    next: (res) => {
      this.authService.saveToken(res.token);
      this.router.navigate(['/layout']);
      this.loading = false;
    },
    error: (err) => {
      if (err.status === 0) {
        this.error = "Impossible de contacter le serveur. Vérifiez votre connexion internet.";
      } else if (err.status === 409) {
        this.error = "Un compte existe déjà avec cet email.";
      } else if (err.error && err.error.message) {
        this.error = err.error.message;
      } else {
        this.error = "Erreur lors de l'inscription. Veuillez réessayer.";
      }
      this.loading = false;
    }
  });
  }
}