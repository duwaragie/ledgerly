import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme';
 import { CommonModule } from '@angular/common';
 import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    public themeService: ThemeService
  ) {}

  logout(): void {
    this.authService.logout();
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }
}
