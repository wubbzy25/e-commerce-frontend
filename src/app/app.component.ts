import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './Services/AuthService';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './Interceptors/AuthInterceptor';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductsService } from './Services/ProductsService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers: [
    AuthService,
    ProductsService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
