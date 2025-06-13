import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Layout } from './dashboard/layout/layout';
import { Overview } from './dashboard/overview/overview';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'dashboard',
    component: Layout,
    children: [
      { path: '', component: Overview },
    ]
  }
];
