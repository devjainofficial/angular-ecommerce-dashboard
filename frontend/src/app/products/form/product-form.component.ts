// products/form/product-form.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id?: number;
  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    imageUrl: ['', [Validators.pattern('https?://.+')]]
  });

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.api.getProductById(this.id).subscribe(p => this.form.patchValue(p));
    }
  }

  submit() {
    if (this.form.invalid) return;
    const product = {
      name: this.form.value.name ?? '',
      description: this.form.value.description ?? '',
      price: this.form.value.price ?? 0,
      stock: this.form.value.stock ?? 0,
      imageUrl: this.form.value.imageUrl ?? ''
    };
    
    let save: Observable<any>;
    if (this.id) {
      save = this.api.updateProduct(this.id!, product);
    } else {
      save = this.api.createProduct(product);
    }
    save.subscribe(() => this.router.navigate(['/products']));
  }
}
