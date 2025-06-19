import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workout } from '../model/workout.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkoutsService {
  private baseUrl = `${environment.serverBasePath}/workouts`;
  private userUrl = `${environment.serverBasePath}/users`;

  constructor(private http: HttpClient) {}

  getAllWorkouts(): Observable<Workout[]> {
    return this.http.get<Workout[]>(this.baseUrl);
  }

  getWorkoutById(workoutId: number): Observable<Workout> {
    return this.http.get<Workout>(`${this.baseUrl}/${workoutId}`);
  }


  /** Obtiene las workoutas creadas por un usuario */
  getWorkoutsByUser(userId: number): Observable<Workout[]> {
    return this.http.get<Workout[]>(`${this.userUrl}/${userId}/workouts`);
  }

  assignWorkoutToUser(userId: number, workoutId: number): Observable<any> {
    return this.http.post(`${this.userUrl}/${userId}/workouts/${workoutId}`, {});
  }
  assignExerciseToWorkout(workoutId: number, exerciseId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${workoutId}/exercises/${exerciseId}`, {});
  }
  /** Crea una nueva workouta (sin meals aún) */
  createWorkout(payload: { title: string; description: string }): Observable<Workout> {
    // mapeo description → description
    const body = {
      title: payload.title,
      description: payload.description
    };
    return this.http.post<Workout>(this.baseUrl, body);
  }

  /** Actualiza título/nota de una workouta existente */
  updateWorkout(workoutId: number, payload: { title: string; description: string }): Observable<Workout> {
    const body = {
      title: payload.title,
      description: payload.description
    };
    return this.http.put<Workout>(`${this.baseUrl}/${workoutId}`, body);
  }
}
