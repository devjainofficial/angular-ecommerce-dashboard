import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductResolver implements Resolve<Product | null> {
  constructor(private productService: ProductService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Product | null> {
    const id = Number(route.paramMap.get('id'));
    if (!id) return of(null);
    return this.productService.getProductById(id).pipe(
      catchError(() => of(null))
    );
  }
} 