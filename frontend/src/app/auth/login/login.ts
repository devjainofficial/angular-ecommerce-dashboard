import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){
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
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = err.error.message || 'Invalid Credentials';
        }
      }) 
    }
  }

}
