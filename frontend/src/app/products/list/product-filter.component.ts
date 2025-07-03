import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'product-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-filter.component.html'
})
export class ProductFilterComponent {
  @Input() search = '';
  // @Input() categories: string[] = [];
  @Output() filterChange = new EventEmitter<string>();

  onSearch(value: string) {
    this.filterChange.emit(value);
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onSearch(value);
  }
} 