import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toast: ToastService){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }
  ngOnInit() {
    if (this.authService.getToken()) {
      this.router.navigate(['/dashboard']);
    }
  }
  onSubmit(){
    if(this.loginForm.valid){
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.authService.saveToken(res.token);
          this.toast.showSuccess('Login successful!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.toast.showError(err.error.message || 'Invalid Credentials');
        }
      }) 
    }
  }

}
