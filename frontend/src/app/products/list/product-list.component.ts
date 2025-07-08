import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { ProductService } from "../product.service";
import { Product } from "../product.model";
import { ProductFilterComponent } from './product-filter.component';
import { ModalComponent } from './product-delete-modal.component';
import { ToastService } from '../../shared/toast.service';
import { Subject } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { CartService } from '../cart/cart.service';
import { ProductCardComponent } from './product-card.component';

@Component({
    selector: 'product-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent, ProductFilterComponent, ModalComponent],
    templateUrl: './product-list.component.html'
})

export class ProductListComponent implements OnInit{
    private api = inject(ProductService);
    private router = inject(Router);
    private toast = inject(ToastService);
    private auth = inject(AuthService);
    private cartService = inject(CartService);
    
    products: Product[] = [];
    pageIndex = 1;
    pageSize = 5;
    isLastPage = false;
    filterText = '';
    showModal = false;
    productToDelete: Product | null = null;
    private searchSubject = new Subject<string>();
    loading = false;
    isAdmin = false;


    ngOnInit() {
        this.isAdmin = this.auth.getUserRole() === 'Admin';
        this.searchSubject.pipe(
            debounceTime(400)
        ).subscribe(value => {
            this.filterText = value;
            this.pageIndex = 1;
            this.fetch();
        });
        this.fetch();
    }

    sortBy = 'name';
    sortDir = 'asc';

    fetch() {
        this.loading = true;
        this.api.getAllProductsPaginated(this.pageIndex, this.pageSize, this.filterText, this.sortBy, this.sortDir)
        .pipe(delay(100))
        .subscribe({
            next: (p) => {
                this.products = p;
                this.isLastPage = p.length < this.pageSize;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    onSortChange(field: string) {
        this.sortBy = field;
        this.pageIndex = 1;
        this.fetch();
    }
    onSortDirChange(dir: string) {
        this.sortDir = dir;
        this.pageIndex = 1;
        this.fetch();
    }

    nextPage() {
        if (!this.isLastPage) {
            this.pageIndex++;
            this.fetch();
        }
    }

    prevPage() {
        if (this.pageIndex > 1) {
            this.pageIndex--;
            this.fetch();
        }
    }

    delete(id: number){
        const product = this.products.find(p => p.id === id) || null;
        this.productToDelete = product;
        this.showModal = true;
    }

    confirmDelete() {
        if (this.productToDelete && this.productToDelete.id) {
            this.api.deleteProduct(this.productToDelete.id).subscribe({
                next: () => {
                    this.fetch();
                    this.closeModal();
                    this.toast.showSuccess('Product deleted!');
                },
                error: () => {
                    this.toast.showError('Failed to delete product.');
                }
            });
        }
    }

    closeModal() {
        this.showModal = false;
        this.productToDelete = null;
    }

    edit(id: number) {
        this.router.navigate(['/products', id, 'edit']);
    }

    onFilterChange(value: string) {
        this.searchSubject.next(value);
    }

    addToCart(product: Product) {
        this.cartService.addToCart(product);
        this.toast.showSuccess('Product added to cart!');
    }
}