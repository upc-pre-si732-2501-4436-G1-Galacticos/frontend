// src/app/iam/pages/forgot-password/forgot-password.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BaseFormComponent } from '../../../shared/components/base-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent extends BaseFormComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  message = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const email = this.form.value.email;
    this.auth.forgotPassword(email).subscribe({
      next: res => {
        this.message = res.message || 'Reset link sent!';
        this.error = '';
      },
      error: err => {
        this.error = err.error?.message || 'Something went wrong.';
        this.message = '';
      }
    });
  }
}
