import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Workout} from '../../../model/workout.model';
import {WorkoutsService} from '../../../services/workouts.service';
import {WorkoutCreateDialogComponent} from '../workout-create-dialog/workout-create-dialog.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-workout-details-dialog',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './workout-details-dialog.component.html',
  styleUrl: './workout-details-dialog.component.css'
})
export class WorkoutDetailsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { workout: Workout; isCommunity: boolean; userId?: number },
    private dialogRef: MatDialogRef<WorkoutDetailsDialogComponent>,
    private workoutsSvc: WorkoutsService,
    private dialog: MatDialog

  ) {}

  close() {
    this.dialogRef.close();
  }


  makeCurrent() {
    this.dialogRef.close({ setCurrent: this.data.workout });
  }
  edit() {
    // Abre el diálogo de creación en modo "editar"
    const ref = this.dialog.open(WorkoutCreateDialogComponent, {
      width: '600px',
      data: { workout: this.data.workout, editMode: true }
    });

    ref.afterClosed().subscribe(updated => {
      if (updated) {
        // si quieres, recarga o cierra pasándole un flag para refrescar lista
        this.dialogRef.close({ refreshed: true });
      }
    });
  }

}
