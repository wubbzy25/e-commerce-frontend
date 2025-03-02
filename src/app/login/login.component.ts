import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../Services/AuthService';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  fb = inject(FormBuilder); // Inject FormBuilder instance

  form: FormGroup = this.fb.group({
    // Define form group with form controls
    email: ['', [Validators.required, Validators.email]], // Email field with validation
    password: [
      '',
      [
        Validators.required, // Password field with validation
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*\\d{2,})(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,24}$'
        ), // Password pattern validation: at least one uppercase letter, two digits, one special character, and length between 8-24
      ],
    ],
  });

  constructor(
    private authService: AuthService, // Inject AuthService
    private router: Router, // Inject Router
    private toastr: ToastrService // Inject ToastrService
  ) {}

  onSubmit() {
    const { email, password } = this.form.value; // Get email and password values from the form
    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.router.navigate(['/']); // Navigate to home page on successful login
      },
      error: (error) => {
        if (error.error.exception === 'EmailDontExists') {
          this.toastr.error('Please check your email', 'Email Not Found'); // Show error toast if email doesn't exist
          return;
        }

        if (error.error.exception === 'BadCredentials') {
          this.toastr.error(
            'Please check your password',
            'Invalid Credentials'
          ); // Show error toast if credentials are invalid
          return;
        }

        this.toastr.error('An error occurred', 'Error'); // Show generic error toast for other errors
        return;
      },
    });
  }
}
