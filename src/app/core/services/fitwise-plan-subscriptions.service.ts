import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FitwisePlanSubscriptionsService {
  private baseUrl = environment.serverBasePath + '/plan-subscriptions';

  constructor(private http: HttpClient) {}

  getFitwisePlansSubscriptionsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/${userId}`);
  }

  getPlanSubscriptionById(planId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${planId}`);
  }

}
