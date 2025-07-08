import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  message: string;
  type: ToastType;
  duration?: number; // ms
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: ToastType, duration = 3000) {
    this.toastSubject.next({ message, type, duration });
  }
  showSuccess(message: string, duration = 3000) {
    this.show(message, 'success', duration);
  }
  showError(message: string, duration = 3000) {
    this.show(message, 'error', duration);
  }
  showInfo(message: string, duration = 3000) {
    this.show(message, 'info', duration);
  }
  clear() {
    this.toastSubject.next(null);
  }
} 