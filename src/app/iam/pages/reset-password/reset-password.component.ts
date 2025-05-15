// src/app/iam/pages/reset-password/reset-password.component.ts
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseFormComponent} from '../../../shared/components/base-form.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent extends BaseFormComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  message = '';
  error = '';

  private token = '';
  private email = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    // Capturar email y token de los query params
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
      console.log(this.token);
      console.log(this.email);
    });

    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const newPassword = this.form.value.newPassword;
    this.auth.resetPassword(this.token, this.email, newPassword).subscribe({
      next: res => {
        this.message = res.message || 'Your password has been reset!';
        this.error = '';
        // Redirigir al login tras unos segundos
        setTimeout(() => this.router.navigate(['/sign-in']), 3000);
      },
      error: err => {
        this.error = err.error?.message || 'Reset token invalid or expired.';
        this.message = '';
      }
    });
  }
}

