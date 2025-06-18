import { Component, OnInit } from '@angular/core';
import { Workout } from '../../model/workout.model';
import { RoutineDetailsDialogComponent } from '../../components/routine-details-dialog/routine-details-dialog.component';
import { RoutinesService } from '../../services/routines.service';
import { RoutineListComponent } from '../../components/routine-list/routine-list.component';
import { CommonModule } from '@angular/common';
import {FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-routines-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    RoutineListComponent,
  ],
  templateUrl: './routines-management.component.html',
  styleUrl: './routines-management.component.css'
})
export class RoutinesManagementComponent implements OnInit {
  workouts: Workout[] = [];
  currentWorkout?: Workout;
  newWorkout: Partial<Workout>={
    title: '',
    note: '',
    exercises: [],
  };

  constructor(private dialog: MatDialog, private routinesService: RoutinesService) {
  }
  ngOnInit(): void {
    this.loadWorkouts();
  }

  loadWorkouts(): void {
    this.routinesService.getAllWorkouts().subscribe(workouts => this.workouts = workouts);
  }

  createRoutine(): void {
    if (this.newWorkout.title && this.newWorkout.note) {
      const fakeId = Date.now();
      const newWorkout: Workout = {
        id: fakeId,
        title: this.newWorkout.title!,
        note: this.newWorkout.note!,
        exercises: []
      };
      this.workouts.push(newWorkout);
      this.newWorkout = { title: '', note: '', exercises: [] };
    }
  }

  assignCurrentWorkout(workout: Workout): void {
    this.currentWorkout = workout;
  }

  openRoutineDetails(workoutId: number) {
    this.routinesService.getWorkoutById(workoutId).subscribe(workout => {
      const dialogRef = this.dialog.open(RoutineDetailsDialogComponent, {
        width: '400px',
        data: workout
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result?.assign) {
          this.assignCurrentWorkout(result.workoutId); // tu lógica existente aquí
        }
      });
    });
  }
}
