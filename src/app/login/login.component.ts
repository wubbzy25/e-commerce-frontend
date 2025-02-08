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
    console.log(email, password);
    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login error', error);
        this.toastr.error('Login failed. please try again', 'error');
      },
    });
  }
}
