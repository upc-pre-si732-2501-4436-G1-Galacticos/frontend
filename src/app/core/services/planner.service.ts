import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment} from '../../../environments/environment';

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
  private baseUrl = `${environment.serverBasePath}`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los planes FitWise recomendados para un perfil específico
   * @param profileId ID del perfil
   */
  getRecommendedPlans(profileId: number): Observable<FitwisePlan[]> {
    const url = `${this.baseUrl}/profiles/${profileId}/recomended-fitwise-plans`;
    return this.http.get<FitwisePlan[]>(url);
  }
}
