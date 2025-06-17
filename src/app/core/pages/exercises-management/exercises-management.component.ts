import { Component, OnInit } from '@angular/core';
import { ExercisesService } from '../../services/exercises.service';
import { Exercise } from '../../model/exercise.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-exercises-management',
  templateUrl: './exercises-management.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  styleUrls: ['./exercises-management.component.css']
})
export class ExercisesManagementComponent implements OnInit {

  exercises: Exercise[] = [];
  selectedExercise: Exercise = this.createEmptyExercise();
  userId: number | null = null;

  constructor(private exercisesService: ExercisesService) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    this.userId = storedUserId !== null && !isNaN(Number(storedUserId)) ? Number(storedUserId) : null;

    if (this.userId !== null) {
      this.getExercisesByUser(this.userId);
    } else {
      console.error('No se encontró un userId válido en localStorage');
    }
  }

  getExercisesByUser(userId: number): void {
    this.exercisesService.getExercisesByUser(userId).subscribe({
      next: (data) => this.exercises = data,
      error: (err) => console.error('Error al obtener ejercicios del usuario:', err)
    });
  }

  saveExercise(): void {
    if (this.selectedExercise.id) {
      this.exercisesService.updateExercise(this.selectedExercise.id, this.selectedExercise).subscribe({
        next: (updated) => {
          const index = this.exercises.findIndex(e => e.id === updated.id);
          if (index !== -1) {
            this.exercises[index] = updated;
          }
          this.resetForm();
        },
        error: (err) => console.error('Error al actualizar ejercicio:', err)
      });
    } else {
      this.exercisesService.createExercise(this.selectedExercise).subscribe({
        next: (created) => {
          this.exercises.push(created);
          this.resetForm();
        },
        error: (err) => console.error('Error al crear ejercicio:', err)
      });
    }
  }

  editExercise(exercise: Exercise): void {
    this.selectedExercise = { ...exercise };
  }

  resetForm(): void {
    this.selectedExercise = this.createEmptyExercise();
  }

  private createEmptyExercise(): Exercise {
    return {
      title: '',
      description: ''
    };
  }
}
