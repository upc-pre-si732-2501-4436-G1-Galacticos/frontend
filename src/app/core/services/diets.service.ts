import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Diet} from '../model/diet.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DietsService {
  private baseUrl = `${environment.serverBasePath}/diets`;
  private userUrl = `${environment.serverBasePath}/users`;

  constructor(private http: HttpClient) {
  }

  /** Obtiene todas las dietas de la comunidad */
  getAllDiets(): Observable<Diet[]> {
    return this.http.get<Diet[]>(this.baseUrl);
  }

  /** Obtiene las dietas creadas por un usuario */
  getDietsByUser(userId: number): Observable<Diet[]> {
    return this.http.get<Diet[]>(`${this.userUrl}/${userId}/diets`);
  }

  /** Obtiene detalle de una dieta por ID */
  getDietById(dietId: number): Observable<Diet> {
    return this.http.get<Diet>(`${this.baseUrl}/${dietId}`);
  }

  /** Crea una nueva dieta (sin meals aún) */
  createDiet(payload: { title: string; description: string }): Observable<Diet> {
    // mapeo description → description
    const body = {
      title: payload.title,
      description: payload.description
    };
    return this.http.post<Diet>(this.baseUrl, body);
  }

  /** Actualiza título/nota de una dieta existente */
  updateDiet(dietId: number, payload: { title: string; description: string }): Observable<Diet> {
    const body = {
      title: payload.title,
      description: payload.description
    };
    return this.http.put<Diet>(`${this.baseUrl}/${dietId}`, body);
  }

  /** Asigna una meal a la dieta */
  assignMealToDiet(dietId: number, mealId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${dietId}/meals/${mealId}`, {});
  }

  /** Asigna una dieta de la comunidad al usuario */
  assignDietToUser(userId: number, dietId: number): Observable<any> {
    return this.http.post(`${this.userUrl}/${userId}/diets/${dietId}`, {});
  }

  /** Crea una nueva dieta para un usuario (sin meals aún) */
  createDietForUser(userId: number, payload: { title: string; description: string }): Observable<Diet> {
    return this.http.post<Diet>(`${this.userUrl}/${userId}/diets`, payload);
  }

  /** (Opcional) Remueve una meal de la dieta */
  removeMealFromDiet(dietId: number, mealId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${dietId}/meals/${mealId}`);
  }
}
