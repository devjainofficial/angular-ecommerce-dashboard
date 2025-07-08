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

    getAllProductsPaginated(pageIndex: number, pageSize: number, search: string = ''): Observable<Product[]> {
        let url = `${this.base}/get-all-products?pageIndex=${pageIndex}&pageSize=${pageSize}`;
        if (search && search.trim()) {
            url += `&search=${encodeURIComponent(search.trim())}`;
        }
        return this.http.get<Product[]>(url);
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
