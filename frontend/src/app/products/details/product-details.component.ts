import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Product } from '../product.model';

@Component({
  selector: 'product-details',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent {
  private route = inject(ActivatedRoute);
  product: Product | null = null;

  constructor() {
    this.route.data.subscribe(data => {
      this.product = data['product'] || null;
    });
  }
} 