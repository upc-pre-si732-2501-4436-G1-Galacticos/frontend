import { Component, OnInit } from '@angular/core';
import { Workout } from '../../model/workout.model';
import { WorkoutsService } from '../../services/workouts.service';
import { RoutineListComponent } from '../../components/routine-list/routine-list.component';
import { CommonModule } from '@angular/common';
import {FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {WorkoutCreateDialogComponent} from '../../components/workout/workout-create-dialog/workout-create-dialog.component';
import {
  CommunityWorkoutDialogComponent
} from '../../components/workout/community-workout-dialog/community-workout-dialog.component';
import {WorkoutDetailsDialogComponent} from '../../components/workout/workout-details-dialog/workout-details-dialog.component';
import {DietListComponent} from '../../components/diet/diet-list/diet-list.component';
import {WorkoutListComponent} from '../../components/workout/workout-list/workout-list.component';
import {TranslateModule} from '@ngx-translate/core';


@Component({
  selector: 'app-routines-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    WorkoutListComponent,
    TranslateModule
  ],
  templateUrl: './routines-management.component.html',
  styleUrl: './routines-management.component.css'
})
export class RoutinesManagementComponent implements OnInit {
  myWorkouts: Workout[] = [];
  currentWorkout?: Workout;
  currentUserId = Number(localStorage.getItem('userId'));

  constructor(
    private workoutsSvc: WorkoutsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadMyWorkouts();
  }

  private loadMyWorkouts() {
    this.workoutsSvc.getWorkoutsByUser(this.currentUserId)
      .pipe(
        tap(ds => this.myWorkouts = ds),
        switchMap(() => {
          const stored = localStorage.getItem('currentWorkoutId');
          return stored
            ? this.workoutsSvc.getWorkoutById(+stored)
            : of(null);
        })
      )
      .subscribe(d => {
        if (d) {
          this.currentWorkout = d;
        }
      });
  }

  openCreateDialog() {
    const ref = this.dialog.open(WorkoutCreateDialogComponent, {
      data: { userId: this.currentUserId }
    });
    ref.afterClosed().subscribe((created: Workout) => {
      if (created?.id) {
        this.myWorkouts.push(created);
        this.setCurrentWorkout(created);
      }
    });
  }

  openCommunityDialog() {
    const ref = this.dialog.open(CommunityWorkoutDialogComponent, {
      data: { userId: this.currentUserId }
    });
    ref.afterClosed().subscribe((selected: Workout) => {
      if (selected?.id) {
        this.setCurrentWorkout(selected);
      }
    });
  }

  openDetails(workout: Workout, isCommunity: boolean = false) {
    const ref = this.dialog.open(WorkoutDetailsDialogComponent, {
      data: { workout, isCommunity, userId: this.currentUserId }
    });

    ref.afterClosed().subscribe(result => {
      // 1) Si devuelve { setCurrent: Workout }
      if ((result as any)?.setCurrent) {
        this.setCurrentWorkout((result as any).setCurrent);
      }
      // 2) Si es un Workout (actualizado en modo propio)
      else if ((result as Workout)?.id) {
        const upd = result as Workout;
        this.myWorkouts = this.myWorkouts.map(d => d.id === upd.id ? upd : d);
      }
      // 3) Si confirma desde comunidad (true)
      else if (isCommunity && result === true) {
        this.workoutsSvc.assignWorkoutToUser(workout.id, this.currentUserId)
          .subscribe(() => this.loadMyWorkouts());
      }
    });
  }

  private setCurrentWorkout(d: Workout) {
    this.currentWorkout = d;
    localStorage.setItem('currentWorkoutId', d.id.toString());
  }

}
