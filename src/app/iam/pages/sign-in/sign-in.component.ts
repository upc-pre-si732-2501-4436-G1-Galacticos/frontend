import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {SignInRequest} from "../../model/sign-in.request";
import {BaseFormComponent} from "../../../shared/components/base-form.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { SignInTwoFactorComponent } from  '../sign-in-two-factor/sign-in-two-factor.component'

import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent extends BaseFormComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  onLoading = false;

  constructor(  private router: Router,
                private builder: FormBuilder,
                private authenticationService: AuthService,

                private dialog: MatDialog ) {
    super();
  }
  openLoginModal() {
    this.dialog.open(SignInTwoFactorComponent, {
      width: '600px',
      disableClose: true
    });
  }
  closeLoginModal(){
    this.dialog.closeAll();
  }

  ngOnInit(): void {

    this.form = this.builder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.authenticationService.currentRequestTwoFactorModal.subscribe(show => {
      if (show) {
        this.openLoginModal();
        this.onLoading=false;
        this.submitted=true;
      }else{
        this.closeLoginModal();
      }
    });

  }

  onSubmit() {
    if (this.form.invalid) return    alert("Invalid fields");
    this.onLoading=true;
    let email = this.form.value.email;
    let password = this.form.value.password;
    const signInRequest = new SignInRequest(email, password);
    this.authenticationService.signIn(signInRequest);
    this.router.navigate([], {
      queryParams: { email: email },
    });

  }

  navigateToRegister(): void {
    this.router.navigate(['/sign-up']).then();
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']).then();
  }
}
