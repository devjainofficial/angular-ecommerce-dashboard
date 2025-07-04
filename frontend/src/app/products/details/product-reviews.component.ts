import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'product-reviews',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-8 p-6 bg-gray-50 rounded-lg border text-center text-gray-500">
      <h2 class="text-xl font-bold mb-2">Reviews</h2>
      <p>Reviews functionality coming soon!</p>
    </div>
  `
})
export class ProductReviewsComponent {} 