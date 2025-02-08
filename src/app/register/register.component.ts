import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  MinValidator,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../Services/AuthService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required, Validators.minLength(10)],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      terms: [false, Validators.requiredTrue],
    });
  }

  onSubmitRegister() {
    const { first_name, last_name, email, phone, password, confirmPassword } =
      this.form.value;
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
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.errorMessage = 'Registration failed. Please try again.';
          console.error('Registration error', error);
        },
      });
  }
}
