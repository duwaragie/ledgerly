import { Component } from '@angular/core';
 import { CommonModule } from '@angular/common';
 import { RouterOutlet } from '@angular/router';
 import { HeaderComponent } from './core/layout/header/header';
 import { SidebarComponent } from './core/layout/sidebar/sidebar';
 import { FooterComponent } from './core/layout/footer/footer';
 import { ToastComponent } from './core/layout/toast/toast';
 import { AuthService } from './core/services/auth';

 @Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
   title = 'Trackonomics';

   constructor(public authService: AuthService) {}

   get isLoggedIn(): boolean {
     return this.authService.isAuthenticated();
   }
 }
