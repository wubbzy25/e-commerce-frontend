import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: AppComponent,
  },
  {
    path: 'register',
    title: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    title: 'login',
    component: LoginComponent,
  },
];
