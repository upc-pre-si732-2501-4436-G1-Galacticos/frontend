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

  getMealsByUser(userId: number): Observable<Meal[]> {
    return this.http.get<Meal[]>(`${this.base}/users/${userId}/meals`);
  }

  createMeal(data: Meal): Observable<Meal> {
    return this.http.post<Meal>(`${this.base}/meals`, data);
  }

  updateMeal(mealId: number, data: Meal): Observable<Meal> {
    return this.http.put<Meal>(`${this.base}/meals/${mealId}`, data);
  }
}
