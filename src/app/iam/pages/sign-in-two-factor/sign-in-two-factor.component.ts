import {Component} from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../services/auth.service';

import {Router, ActivatedRoute} from "@angular/router";
import {TranslateModule} from '@ngx-translate/core';

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
      TranslateModule
    ]
})
export class SignInTwoFactorComponent {
    form: FormGroup;

    constructor(private fb: FormBuilder,
                protected dialogRef: MatDialogRef<SignInTwoFactorComponent>,
                private auth: AuthService,
                private router: Router,
                private route: ActivatedRoute,
    ) {
        this.form = this.fb.group({
            verificationCode: ['', Validators.required],
            email: ['', Validators.required]
        });
    }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['email'];
      if (query) {
        this.form.patchValue({ email: query });

        this.form.get('email')?.disable();
      }else{
        this.form.patchValue({ email: '' });
      }
    });
    }




  onSubmit() {
        if (this.form.invalid) return;
    const { email, verificationCode } = this.form.getRawValue();
    this.auth.twoFactor(email, verificationCode);
    }


}
