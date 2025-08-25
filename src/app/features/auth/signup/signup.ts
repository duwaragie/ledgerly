import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class Signup implements OnInit {
  signupForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.markFormGroupTouched();

      if (this.signupForm.errors?.['passwordMismatch']) {
        this.error = 'Passwords do not match';
        this.toastService.warning('Passwords do not match.', 4000);
        return;
      }

      this.error = 'Please fill out all required fields correctly';
      this.toastService.warning('Please fill out all required fields correctly.', 4000);
      return;
    }

    this.loading = true;
    this.error = '';

    const formValue = this.signupForm.value;

    this.authService.signup(
      formValue.name,
      formValue.email,
      formValue.password
    ).subscribe({
      next: (success: boolean) => {
        this.loading = false;
        if (success) {
          this.toastService.success('Account created successfully! Welcome to Trackonomics! ', 5000);
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Failed to create account. Email may already be in use.';
          this.toastService.error('Failed to create account. Email may already be in use.', 5000);
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = 'An error occurred during signup';
        this.toastService.error('An error occurred during signup. Please try again.', 5000);
        console.error('Signup error:', err);
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }
}
