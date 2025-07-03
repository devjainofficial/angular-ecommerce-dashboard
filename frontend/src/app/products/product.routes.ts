import { Routes } from "@angular/router";
import { provideRouter } from "@angular/router";
import { ProductListComponent } from './list/product-list.component';
import { ProductFormComponent } from './form/product-form.component';

export const productRoutes: Routes = [
    { path: '', component: ProductListComponent },
    { path: 'new', component: ProductFormComponent },
    { path: ':id/edit', component: ProductFormComponent }
];
