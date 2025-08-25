import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());

  constructor(private router: Router) {}

  login(email: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        let user: User | null = null;

        if (email === 'demo@example.com' && password === 'password') {
          user = {
            id: 1,
            name: 'Demo User',
            email: email
          };
        } else {

          const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const foundUser = registeredUsers.find((u: any) => u.email === email && u.password === password);

          if (foundUser) {
            user = {
              id: foundUser.id,
              name: foundUser.name,
              email: foundUser.email
            };
          }
        }

        if (user) {
          localStorage.setItem('authToken', 'fake-jwt-token');
          localStorage.setItem('user', JSON.stringify(user));

          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      }, 1000);
    });
  }

  signup(name: string, email: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userExists = existingUsers.some((user: any) => user.email === email);

        if (userExists) {
          observer.next(false);
        } else {
          const newUser: User = {
            id: Date.now(),
            name: name,
            email: email
          };

          existingUsers.push({ ...newUser, password });
          localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

          localStorage.setItem('authToken', 'fake-jwt-token');
          localStorage.setItem('user', JSON.stringify(newUser));

          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(newUser);
          observer.next(true);
        }
        observer.complete();
      }, 1500);
    });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  private getStoredUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getAllRegisteredUsers(): any[] {
    return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  }

  clearAllRegisteredUsers(): void {
    localStorage.removeItem('registeredUsers');
  }
}
