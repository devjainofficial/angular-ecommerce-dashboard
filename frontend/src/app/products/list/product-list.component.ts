import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { ProductService } from "../product.service";
import { Product } from "../product.model";

@Component({
    selector: 'product-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './product-list.component.html'
})

export class ProductListComponent implements OnInit{
    private api = inject(ProductService);
    
    products: Product[] = [];

    ngOnInit() { 
        this.fetch();
    }

    fetch() {
        this.api.getAllProducts().subscribe(p => this.products = p);
    }

    delete(id: number){
        if(confirm('Delete this product?')){
            this.api.deleteProduct(id).subscribe(() => this.fetch());
        }
    }
}