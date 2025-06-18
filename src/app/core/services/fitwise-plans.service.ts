import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FitwisePlansService {
  private baseUrl = environment.serverBasePath + '/fitwise-plans';

  constructor(private http: HttpClient) {}

  getFitwisePlans(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  assignDietToPlan(planId: number, dietId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${planId}/diets/${dietId}`, {});
  }

  assignWorkoutToPlan(planId: number, workoutId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${planId}/workouts/${workoutId}`, {});
  }

  getPlanById(planId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${planId}`);
  }

}
