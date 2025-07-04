import { Routes } from "@angular/router";
import { provideRouter } from "@angular/router";
import { ProductListComponent } from './list/product-list.component';
import { ProductFormComponent } from './form/product-form.component';
import { ProductDetailsComponent } from './details/product-details.component';
import { ProductResolver } from './product.resolver';

export const productRoutes: Routes = [
    { path: '', component: ProductListComponent },
    { path: 'new', component: ProductFormComponent },
    { path: ':id/edit', component: ProductFormComponent },
    {
      path: ':id/:name',
      component: ProductDetailsComponent,
      resolve: { product: ProductResolver },
      children: [
        {
          path: 'reviews',
          loadComponent: () => import('./details/product-reviews.component').then(m => m.ProductReviewsComponent)
        }
      ]
    }
];
