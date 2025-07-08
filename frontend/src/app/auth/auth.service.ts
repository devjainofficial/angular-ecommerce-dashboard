import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, LoginRequest, RegisterRequest } from './auth.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:44307/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  login(data: LoginRequest): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data);
  } 

  register(data: RegisterRequest): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, data);
  }

  saveToken(token: string): void{
    const now = new Date();
    const expiry = now.getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem('authToken', token);
    localStorage.setItem('authTokenExpiry', expiry.toString());
  }

  getToken(): string | null{
    const token = localStorage.getItem('authToken');
    const expiry = localStorage.getItem('authTokenExpiry');
    if (!token || !expiry) return null;
    if (Date.now() > Number(expiry)) {
      this.logout();
      return null;
    }
    return token;
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role ?? null;
    } catch {
      return null;
    }
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.unique_name ?? null;
    } catch {
      return null;
    }
  }


  logout(){
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiry');
    this.router.navigate(['/login']);
  }
}
