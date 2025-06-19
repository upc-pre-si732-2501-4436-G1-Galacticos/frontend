import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FitwisePlan {
  id: number;
  title: string;
  description: string;
  dietId: number;
  workoutId: number;
  tagNames: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PlannerService {
  private baseUrl = `${environment.serverBasePath}/fitwise-plans`;

  constructor(private http: HttpClient) {}

  // 1. Obtener todos los planes
  getPlans(): Observable<FitwisePlan[]> {
    return this.http.get<FitwisePlan[]>(`${this.baseUrl}`);
  }

  // 2. Crear un nuevo plan
  createPlan(plan: Partial<FitwisePlan>): Observable<FitwisePlan> {
    return this.http.post<FitwisePlan>(`${this.baseUrl}`, plan);
  }

  // 3. Asignar un workout a un plan
  addWorkoutToPlan(fitwisePlanId: number, workoutId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${fitwisePlanId}/workouts/${workoutId}`, {});
  }

  // 4. Eliminar un workout de un plan
  removeWorkoutFromPlan(fitwisePlanId: number, workoutId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${fitwisePlanId}/workouts/${workoutId}`);
  }

  // 5. Asignar una dieta a un plan
  addDietToPlan(fitwisePlanId: number, dietId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${fitwisePlanId}/diets/${dietId}`, {});
  }

  // 6. Eliminar una dieta de un plan
  removeDietFromPlan(fitwisePlanId: number, dietId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${fitwisePlanId}/diets/${dietId}`);
  }

  // Extra: obtener planes recomendados por perfil
  getRecommendedPlans(profileId: number): Observable<FitwisePlan[]> {
    const url = `${environment.serverBasePath}/profiles/${profileId}/recomended-fitwise-plans`;
    return this.http.get<FitwisePlan[]>(url);
  }


}
