import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Exercise } from '../model/exercise.model';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {
  private base = `${environment.serverBasePath}`;

  constructor(private http: HttpClient) {}

  /** Obtener ejercicios creados por el usuario */
  getExercisesByUser(userId: number): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.base}/users/${userId}/exercises`);
  }

  getExerciseById(exerciseId: number): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.base}/exercises/${exerciseId}`);
  }

  createExercise(data: Exercise): Observable<Exercise> {
    return this.http.post<Exercise>(`${this.base}/exercises`, data);
  }

  updateExercise(exerciseId: number, data: Exercise): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.base}/exercises/${exerciseId}`, data);
  }
  /** (Opcional) Obtiene todas las exercises de la comunidad */
  getAllCommunityExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.base}/exercises`);
  }
}
