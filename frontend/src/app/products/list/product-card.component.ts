import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../product.model';

@Component({
    selector: 'product-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './product-card.component.html'
  })
  export class ProductCardComponent {
    @Input() product!: Product;
    @Output() delete = new EventEmitter<number>();
    @Output() edit = new EventEmitter<number>();
  }
