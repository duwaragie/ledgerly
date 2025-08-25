import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastService.warning('Please enter valid email and password.', 4000);
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(
      this.loginForm.controls['email'].value,
      this.loginForm.controls['password'].value
    ).subscribe({
      next: (success) => {
        this.loading = false;
        if (success) {
          this.toastService.success('Welcome back! Login successful! 👋', 4000);
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Invalid email or password';
          this.toastService.error('Invalid email or password. Please try again.', 5000);
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'An error occurred during login';
        this.toastService.error('An error occurred during login. Please try again.', 5000);
      }
    });
  }
}
