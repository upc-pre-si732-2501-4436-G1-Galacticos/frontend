import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workout } from '../model/workout.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RoutinesService {
  private baseUrl = `${environment.serverBasePath}/workouts`;

  constructor(private http: HttpClient) {}

  getAllWorkouts(): Observable<Workout[]> {
    return this.http.get<Workout[]>(this.baseUrl);
  }

  getWorkoutById(workoutId: number): Observable<Workout> {
    return this.http.get<Workout>(`${this.baseUrl}/${workoutId}`);
  }

  assignExerciseToWorkout(workoutId: number, exerciseId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${workoutId}/exercises/${exerciseId}`, {});
  }
}
