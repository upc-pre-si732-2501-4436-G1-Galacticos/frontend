import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UserProfileRequest } from '../model/user-profile.request';
import { UserProfileResponse } from '../model/user-profile.response';
import { GoalResponse } from '../model/goal.response';
import { ActivityLevelResponse } from '../model/activity-level.response';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private base = environment.serverBasePath;

  constructor(private http: HttpClient) {}

  /** Obtener perfil */
  getProfile(userId: number): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.base}/users/${userId}/profile`);
  }

  /** Crear perfil */
  createProfile(userId: number, data: UserProfileRequest): Observable<UserProfileResponse> {
    localStorage.setItem('heightProfile', data.height.toString());
    localStorage.setItem('weightProfile', data.weight.toString());
    return this.http.post<UserProfileResponse>(`${this.base}/users/${userId}/profile`, data);
  }

  /** Actualizar perfil */
  updateProfile(userId: number, data: UserProfileRequest): Observable<UserProfileResponse> {

    localStorage.setItem('heightProfile', data.height.toString());
    localStorage.setItem('weightProfile', data.weight.toString());
    return this.http.put<UserProfileResponse>(`${this.base}/users/${userId}/profile`, data);
  }

  /** Listar objetivos */
  listGoals(): Observable<GoalResponse[]> {
    return this.http.get<GoalResponse[]>(`${this.base}/goals`);
  }

  /** Listar niveles de actividad */
  listActivityLevels(): Observable<ActivityLevelResponse[]> {
    return this.http.get<ActivityLevelResponse[]>(`${this.base}/activity-levels`);
  }
}
