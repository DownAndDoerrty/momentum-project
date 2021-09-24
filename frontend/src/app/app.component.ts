import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  title = 'tax-breaker';

  onLogout() {
    this.authService.logout();
  }
}
