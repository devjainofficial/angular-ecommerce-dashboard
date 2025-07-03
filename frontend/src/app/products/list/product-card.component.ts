import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../product.model';

@Component({
    selector: 'product-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-card.component.html'
  })
  export class ProductCardComponent {
    @Input() product!: Product;
    @Output() delete = new EventEmitter<number>();
    @Output() edit = new EventEmitter<number>();
  }
