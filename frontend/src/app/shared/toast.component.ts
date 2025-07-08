import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from './toast.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnDestroy {
  toast: ToastMessage | null = null;
  private sub: Subscription;
  private timerSub?: Subscription;

  constructor(private toastService: ToastService) {
    this.sub = this.toastService.toast$.subscribe(toast => {
      this.toast = toast;
      if (toast) {
        this.timerSub?.unsubscribe();
        this.timerSub = timer(toast.duration ?? 3000).subscribe(() => this.close());
      }
    });
  }

  close() {
    this.toast = null;
    this.toastService.clear();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.timerSub?.unsubscribe();
  }
} 