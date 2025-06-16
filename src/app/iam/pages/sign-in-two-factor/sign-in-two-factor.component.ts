import {Component} from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {SignInRequest} from '../../model/sign-in.request';
import {Router} from "@angular/router";

@Component({
    selector: 'app-sign-in-modal',
    standalone: true,
    templateUrl: './sign-in-two-factor.component.html',
    styleUrls: ['./sign-in-two-factor.component.css'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
    ]
})
export class SignInTwoFactorComponent {
    form: FormGroup;

    constructor(private fb: FormBuilder,
                protected dialogRef: MatDialogRef<SignInTwoFactorComponent>,
                private auth: AuthService,
                private router: Router
    ) {
        this.form = this.fb.group({
            verificationCode: ['', Validators.required],
            email: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.form.invalid) return;

        const email = this.form.value.email;
        const verificationCode = this.form.value.verificationCode;

        this.auth.twoFactor(email, verificationCode);
    }


}
