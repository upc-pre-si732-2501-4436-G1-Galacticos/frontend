import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {SignUpRequest} from "../../model/sign-up.request";
import {BaseFormComponent} from "../../../shared/components/base-form.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent extends BaseFormComponent implements OnInit {
  form!: FormGroup;
  submitted = false;

  constructor(private router: Router,private builder: FormBuilder, private authenticationService: AuthService) {
    super();
  }

  ngOnInit(): void {
    this.form = this.builder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    let email = this.form.value.email;
    let password = this.form.value.password;
    const signUpRequest = new SignUpRequest(email, password);
    this.authenticationService.signUp(signUpRequest);
    this.submitted = true;
  }

  navigateToLogin(): void {
    this.router.navigate(['/sign-in']).then();
  }
}
