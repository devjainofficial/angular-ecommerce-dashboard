import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toast: ToastService){
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  onSubmit(){
    if(this.registerForm.valid){
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.authService.saveToken(res.token);
          this.toast.showSuccess('Registration successful!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.toast.showError(err.error.message || 'Registration failed');
        }
      })
    }
  }
}
