import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToastComponent } from './shared/toast.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, SidebarComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'angular-ecommerce';

  constructor(private router: Router) {}

  isAuthRoute(): boolean {
    return this.router.url.startsWith('/login') || this.router.url.startsWith('/register');
  }
}
