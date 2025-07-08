import {Component, Inject, OnInit} from '@angular/core';
import {Exercise} from '../../../model/exercise.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Workout} from '../../../model/workout.model';
import {ExercisesService} from '../../../services/exercises.service';
import {WorkoutsService} from '../../../services/workouts.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-workout-create-dialog',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    TranslateModule
  ],
  templateUrl: './workout-create-dialog.component.html',
  styleUrl: './workout-create-dialog.component.css'
})
export class WorkoutCreateDialogComponent implements OnInit {
  title = '';
  description = '';
  isEdit = false;
  selectedTabIndex = 0;
  exercisesMy: Exercise[] = [];
  exercisesComm: Exercise[] = [];
  selectedExercises: Exercise[] = [];
  userId = Number(localStorage.getItem('userId'));
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { workout?: Workout },
    private exercisesSvc: ExercisesService,
    private workoutsSvc: WorkoutsService,
    private dialogRef: MatDialogRef<WorkoutCreateDialogComponent>
  ) {}

  ngOnInit(): void {
    // 1) Cargo mis exercises y luego filtro comunidad
    this.exercisesSvc.getExercisesByUser(this.userId).subscribe(myExercises => {
      this.exercisesMy = myExercises;
      const myIds = myExercises.map(m => m.id!);
      this.exercisesSvc.getAllCommunityExercises().subscribe(allComm => {
        this.exercisesComm = allComm.filter(m => !myIds.includes(m.id!));
      });
    });

    // 2) Si venimos a editar, relleno
    if (this.data.workout) {
      this.isEdit = true;
      this.title = this.data.workout.title;
      this.description = this.data.workout.description;
      this.selectedExercises = [...this.data.workout.exercises];
      this.selectedTabIndex = 0;
    }
  }

  onTabChanged(index: number) {
    this.selectedTabIndex = index;
  }

  toggleExercise(exercise: Exercise) {
    const idx = this.selectedExercises.findIndex(m => m.id === exercise.id);
    if (idx > -1) {
      this.selectedExercises.splice(idx, 1);
    } else if (this.selectedExercises.length < 3) {
      this.selectedExercises.push(exercise);
    }
  }

  confirm() {
    const ids = this.selectedExercises.map(m => m.id!);

    if (this.isEdit && this.data.workout) {
      // update existing workout
      this.workoutsSvc.updateWorkout(this.data.workout.id, { title: this.title, description: this.description })
        .subscribe(d => {

          this.dialogRef.close(true);
        });
    } else {
      // **create** via the correct endpoint
      this.workoutsSvc.createWorkout({ title: this.title, description: this.description })
        .subscribe(newWorkout => {
          ids.forEach(id =>
            this.workoutsSvc.assignExerciseToWorkout(newWorkout.id, id).subscribe()
          );
          this.dialogRef.close(true);
        }, err => {
          console.error('Error creating workout:', err);
        });
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
