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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.register(this.form).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/contacts']); // Redirection après inscription
      },
      error: () => {
        this.error = 'Erreur lors de l\'inscription';
      }
    });
  }
}
