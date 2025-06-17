import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Exercise } from '../model/exercise.model';  // Asegúrate de importar tu modelo

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {
  private base = `${environment.serverBasePath}`;

  constructor(private http: HttpClient) {}

  /** Listar todos los ejercicios */
  getAllExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.base}/exercises`);
  }

  /** Obtener ejercicio por ID */
  getExerciseById(exerciseId: number): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.base}/exercises/${exerciseId}`);
  }

  /** Crear nuevo ejercicio */
  createExercise(data: Exercise): Observable<Exercise> {
    return this.http.post<Exercise>(`${this.base}/exercises`, data);
  }

  /** Actualizar ejercicio existente */
  updateExercise(exerciseId: number, data: Exercise): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.base}/exercises/${exerciseId}`, data);
  }

  /** Eliminar ejercicio */
  deleteExercise(exerciseId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/exercises/${exerciseId}`);
  }
}
