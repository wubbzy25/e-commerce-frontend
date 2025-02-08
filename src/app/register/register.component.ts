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
  fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$'),
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*\\d{2,})(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,24}$'
        ),
      ],
    ],
    confirmPassword: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*\\d{2,})(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,24}$'
        ),
      ],
    ],
    terms: [false, Validators.required],
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

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

          this.toastr.error('An error occurred', 'Error');
          return;
        },
      });
  }
}
