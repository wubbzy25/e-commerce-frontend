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
  fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*\\d{2,})(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,24}$'
        ),
      ],
    ],
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit() {
    const { email, password } = this.form.value;
    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        if (error.error.exception === 'EmailDontExists') {
          this.toastr.error('Please check your email', 'Email Not Found');
          return;
        }

        if (error.error.exception === 'BadCredentials') {
          this.toastr.error('Please check your pasword', 'Invalid Credentials');
          return;
        }

        this.toastr.error('An error occurred', 'Error');
        return;
      },
    });
  }
}
