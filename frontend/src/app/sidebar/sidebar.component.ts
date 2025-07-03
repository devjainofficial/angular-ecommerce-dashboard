import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <button
      class="fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded md:hidden"
      (click)="open = true"
      aria-label="Open sidebar"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>

    <aside
      class="fixed top-0 left-0 h-screen w-60 bg-gray-900 text-white flex flex-col p-4 z-40 transition-transform duration-300 md:translate-x-0 md:block"
      [class.-translate-x-full]="!open && !isDesktop"
      [class.translate-x-0]="open || isDesktop"
    >
      <h2 class="text-2xl font-bold mb-8">E-Commerce</h2>
      <nav class="flex flex-col gap-4">
        <a routerLink="/dashboard" class="hover:bg-gray-700 rounded px-3 py-2">Dashboard</a>
        <a routerLink="/products" class="hover:bg-gray-700 rounded px-3 py-2">Products</a>
        <button (click)="logout()" class="hover:bg-gray-700 rounded px-3 py-2 mt-auto text-left">Logout</button>
      </nav>

      <button
        class="mt-8 bg-gray-800 text-white px-4 py-2 rounded md:hidden"
        (click)="open = false"
        aria-label="Close sidebar"
      >Close</button>
    </aside>

    <div
      *ngIf="open && !isDesktop"
      class="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
      (click)="open = false"
    ></div>
  `
})
export class SidebarComponent implements OnInit {
  open = false;
  isDesktop = false;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.updateSidebarState();
    window.addEventListener('resize', this.updateSidebarState.bind(this));
  }

  updateSidebarState() {
    this.isDesktop = window.matchMedia('(min-width: 768px)').matches;
    this.open = this.isDesktop;
  }

  logout() {
    this.auth.logout();
  }
}