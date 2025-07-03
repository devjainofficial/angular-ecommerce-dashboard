import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { ProductService } from "../product.service";
import { Product } from "../product.model";
import { ProductCardComponent } from './product-card.component';
import { ProductFilterComponent } from './product-filter.component';
import { ModalComponent } from './product-delete-modal.component';

@Component({
    selector: 'product-list',
    standalone: true,
    imports: [CommonModule, RouterLink, ProductCardComponent, ProductFilterComponent, ModalComponent],
    templateUrl: './product-list.component.html'
})

export class ProductListComponent implements OnInit{
    private api = inject(ProductService);
    private router = inject(Router);
    
    products: Product[] = [];
    filterText = '';
    showModal = false;
    productToDelete: Product | null = null;

    get filteredProducts(): Product[] {
        if (!this.filterText) return this.products;
        const text = this.filterText.toLowerCase();
        return this.products.filter(p =>
            p.name.toLowerCase().includes(text) ||
            p.description.toLowerCase().includes(text) ||
            p.price.toString().includes(text)
        );
    }

    ngOnInit() { 
        this.fetch();
    }

    fetch() {
        this.api.getAllProducts().subscribe(p => this.products = p);
    }

    delete(id: number){
        const product = this.products.find(p => p.id === id) || null;
        this.productToDelete = product;
        this.showModal = true;
    }

    confirmDelete() {
        if (this.productToDelete && this.productToDelete.id) {
            this.api.deleteProduct(this.productToDelete.id).subscribe(() => {
                this.fetch();
                this.closeModal();
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
        this.filterText = value;
    }
}