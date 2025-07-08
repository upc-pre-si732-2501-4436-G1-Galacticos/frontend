import {Component, OnInit} from '@angular/core';
import {Workout} from '../../../model/workout.model';
import {WorkoutsService} from '../../../services/workouts.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {forkJoin} from 'rxjs';
import {WorkoutDetailsDialogComponent} from '../workout-details-dialog/workout-details-dialog.component';
import {NgForOf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-community-workout-dialog',
  imports: [
    NgForOf,
    TranslateModule
  ],
  templateUrl: './community-workout-dialog.component.html',
  styleUrl: './community-workout-dialog.component.css'
})
export class CommunityWorkoutDialogComponent implements OnInit {
  communityWorkouts: Workout[] = [];
  private userId = Number(localStorage.getItem('userId'));

  constructor(
    private workoutsSvc: WorkoutsService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CommunityWorkoutDialogComponent>
  ) {}

  ngOnInit(): void {
    // Cargo TODAS las workoutas + las de mi usuario y filtro
    forkJoin({
      all: this.workoutsSvc.getAllWorkouts(),
      mine: this.workoutsSvc.getWorkoutsByUser(this.userId)
    }).subscribe(({ all, mine }) => {
      const mineIds = new Set(mine.map(d => d.id));
      this.communityWorkouts = all.filter(d => !mineIds.has(d.id));
    });
  }

  openDetails(workout: Workout) {
    const ref = this.dialog.open(WorkoutDetailsDialogComponent, {
      data: { workout, isCommunity: true, userId: this.userId }
    });
    ref.afterClosed().subscribe(result => {
      // esperamos un objeto con { setCurrent: Workout }
      if ((result as any)?.setCurrent) {
        // cerramos el diálogo de comunidad devolviendo el setCurrent
        this.dialogRef.close((result as any).setCurrent);
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
