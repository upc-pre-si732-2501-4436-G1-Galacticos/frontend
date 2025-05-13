import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Diet } from '../model/diet.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DietsService {
  private baseUrl = `${environment.serverBasePath}/diets`;

  constructor(private http: HttpClient) {}

  getAllDiets(): Observable<Diet[]> {
    return this.http.get<Diet[]>(this.baseUrl);
  }

  getDietById(dietId: number): Observable<Diet> {
    return this.http.get<Diet>(`${this.baseUrl}/${dietId}`);
  }

  assignMealToDiet(dietId: number, mealId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${dietId}/meals/${mealId}`, {});
  }
}
