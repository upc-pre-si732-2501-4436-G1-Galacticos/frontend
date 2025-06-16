import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { UserProfileService } from '../../services/user-profile.service';
import { AuthService } from '../../../iam/services/auth.service';
import { GoalResponse } from '../../model/goal.response';
import { ActivityLevelResponse } from '../../model/activity-level.response';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-profile-management',
  standalone: true,
  templateUrl: './profile-management.component.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    CommonModule,
    MatRadioModule,
  ],
  styleUrls: ['./profile-management.component.css']
})
export class ProfileManagementComponent implements OnInit {
  form!: FormGroup;
  goals: GoalResponse[] = [];
  activityLevels: ActivityLevelResponse[] = [];
  userId!: number;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private profileSvc: UserProfileService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      height: [0, [Validators.required, Validators.min(1)]],
      weight: [0, [Validators.required, Validators.min(1)]],
      activityLevelId: [null, Validators.required],
      goalId: [null, Validators.required],
    });

    // Cargar listas de selección
    forkJoin({
      goals: this.profileSvc.listGoals(),
      levels: this.profileSvc.listActivityLevels(),
      profile: this.profileSvc.getProfile(this.userId).pipe(catchError(() => of(null)))
    }).subscribe(({ goals, levels, profile }) => {
      this.goals = goals;
      this.activityLevels = levels;
      if (profile) {
        this.isEdit = true;
        // Mapear fullName a first/last
        const [firstName, lastName] = profile.fullName.split(' ');
        this.form.patchValue({ ...profile, firstName, lastName });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const req = this.form.value;
    const call = this.isEdit
      ? this.profileSvc.updateProfile(this.userId, req)
      : this.profileSvc.createProfile(this.userId, req);

    call.subscribe(res => {
      this.isEdit = true;
      this.form.patchValue({
        firstName: res.fullName.split(' ')[0],
        lastName: res.fullName.split(' ')[1]
      });
      alert('Perfil guardado correctamente');
    });
  }
}
