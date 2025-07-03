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
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null{
    return localStorage.getItem('authToken');
  }

  logout(){
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
