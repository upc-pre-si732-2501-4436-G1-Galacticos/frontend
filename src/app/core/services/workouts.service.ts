import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {Workout} from '../model/workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutsService {
  private baseUrl = `${environment.serverBasePath}/workouts`;

  constructor(private http: HttpClient) {}

  getWorkoutById(dietId: number): Observable<Workout> {
    return this.http.get<Workout>(`${this.baseUrl}/${dietId}`);
  }

  getAllWorkouts(): Observable<Workout[]> {
    return this.http.get<Workout[]>(`${this.baseUrl}`);
  }


}
