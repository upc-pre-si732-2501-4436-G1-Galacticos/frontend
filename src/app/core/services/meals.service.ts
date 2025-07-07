import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Meal } from '../model/meal.model';

@Injectable({
  providedIn: 'root'
})
export class MealsService {
  private base = `${environment.serverBasePath}`;

  constructor(private http: HttpClient) {}

  /** Obtiene todas las meals creadas por un usuario */
  getMealsByUser(userId: number): Observable<Meal[]> {
    return this.http.get<Meal[]>(`${this.base}/users/${userId}/meals`);
  }

  /** Crea una nueva meal */
  createMeal(data: Meal): Observable<Meal> {
    return this.http.post<Meal>(`${this.base}/meals`, data);
  }

  /** Actualiza una meal existente */
  updateMeal(mealId: number, data: Meal): Observable<Meal> {
    return this.http.put<Meal>(`${this.base}/meals/${mealId}`, data);
  }

  /** (Opcional) Obtiene todas las meals de la comunidad */
   getAllCommunityMeals(): Observable<Meal[]> {
     return this.http.get<Meal[]>(`${this.base}/meals`);
   }

}
