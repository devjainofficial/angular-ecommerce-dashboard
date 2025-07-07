import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Overview } from './dashboard/overview/overview';
import { AuthGuard } from './auth/auth.guard';
import { Layout } from './dashboard/layout/layout';
import { CartComponent } from './products/cart/cart.component';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: Layout,
        children: [
          { path: '', component: Overview },
          { path: 'cart', component: CartComponent },
        ]
      },
      {
        path: 'products',
        loadChildren: () => import('./products/product.routes').then(m => m.productRoutes)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
