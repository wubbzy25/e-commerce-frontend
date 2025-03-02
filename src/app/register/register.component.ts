import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../Services/AuthService';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  fb = inject(FormBuilder); // Inject FormBuilder instance
  form: FormGroup = this.fb.group({
    // Define form group with form controls
    first_name: ['', Validators.required], // First name field with validation
    last_name: ['', Validators.required], // Last name field with validation
    email: ['', [Validators.required, Validators.email]], // Email field with validation
    phone: [
      '',
      [
        Validators.required, // Phone field with validation
        Validators.minLength(10), // Minimum length of 10 digits
        Validators.maxLength(10), // Maximum length of 10 digits
        Validators.pattern('^[0-9]*$'), // Only numeric digits allowed
      ],
    ],
    password: [
      '',
      [
        Validators.required, // Password field with validation
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*\\d{2,})(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,24}$'
        ), // Password pattern validation: at least one uppercase letter, two digits, one special character, and length between 8-24
      ],
    ],
    confirmPassword: [
      '',
      [
        Validators.required, // Confirm password field with validation
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*\\d{2,})(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,24}$'
        ), // Confirm password pattern validation: same as password
      ],
    ],
    terms: [false, Validators.required], // Terms and conditions acceptance field with validation
  });

  constructor(
    private authService: AuthService, // Inject AuthService
    private router: Router, // Inject Router
    private toastr: ToastrService // Inject ToastrService
  ) {}

  onSubmitRegister() {
    // Handle form submission
    const { first_name, last_name, email, phone, password, confirmPassword } =
      this.form.value; // Get form values
    this.authService
      .register({
        first_name,
        last_name,
        email,
        phone,
        password,
        confirmPassword,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/']); // Navigate to home page on successful registration
        },
        error: (error) => {
          // Handle different error cases
          if (error.error.exception === 'UserAlreadyExists') {
            this.toastr.error(
              'The email is already registered, try another one',
              'User already exists'
            );
            return;
          }
          if (error.error.exception === 'BadCredentials') {
            this.toastr.error('Passwords must match', 'Invalid Credentials');
            return;
          }

          this.toastr.error('An error occurred', 'Error'); // Show generic error toast for other errors
          return;
        },
      });
  }
}
