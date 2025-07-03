import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root'})

export class ProductService{
    private http = inject(HttpClient);
    private base = 'https://localhost:44307/api/products'

    getAllProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.base}/get-all-products`);
    }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.base}/get-by-productId/${id}`);
    }

    createProduct(product: Product): Observable<Product> {
        return this.http.post<Product>(`${this.base}/create-product`, product);
    }

    updateProduct(id: number, product: Product): Observable<void> {
        return this.http.put<void>(`${this.base}/update-product/${id}`, product);
    }

    deleteProduct(id: number): Observable<void>{
        return this.http.delete<void>(`${this.base}/delete-product/${id}`)
    }
}       
