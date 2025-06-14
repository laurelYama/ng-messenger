import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  template: `<router-outlet />`
})
export class AppComponent {
  title = 'smstech';

  constructor(private router: Router) {}

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Ctrl + Shift + H
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'h') {
      event.preventDefault();
      this.router.navigate(['/home']);
    }
  }
}