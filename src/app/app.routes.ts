import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './Guards/AuthGuard';
import { AlreadyAuthGuard } from './Guards/AlreadyAuthGuard';
import { HomeComponent } from './home/home.component';
import { CardComponent } from './card/card.component';
import { CatalogComponent } from './catalog/catalog.component';
import { DetailsComponent } from './details/details.component';
import { CartComponent } from './cart/cart.component';
import { SuccessComponent } from './success/success.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    canActivate: [AuthGuard],
    component: HomeComponent,
  },
  {
    path: 'register',
    title: 'register',
    canActivate: [AlreadyAuthGuard],
    component: RegisterComponent,
  },
  {
    path: 'login',
    title: 'login',
    canActivate: [AlreadyAuthGuard],
    component: LoginComponent,
  },
  {
    path: 'catalog',
    title: 'catalog',
    canActivate: [AuthGuard],
    component: CatalogComponent,
  },
  {
    path: 'product-details/:id',
    title: 'details',
    canActivate: [AuthGuard],
    component: DetailsComponent,
  },
  {
    path: 'shopping-cart',
    title: 'shopping-cart',
    canActivate: [AuthGuard],
    component: CartComponent,
  },
  {
    path: 'success',
    title: 'success',
    component: SuccessComponent,
  },
  {
    path: '**',
    title: 'Page not found',
    component: NotFoundComponent,
  },
];
