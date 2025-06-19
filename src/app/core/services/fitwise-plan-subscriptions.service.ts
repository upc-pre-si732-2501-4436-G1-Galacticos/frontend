import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {Exercise} from '../model/exercise.model';
import {FitwisePlanSubscriptionModel} from '../model/fitwise-plan-subscription.model';

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
  assignPlanSubscriptionToUserId(data: FitwisePlanSubscriptionModel): Observable<FitwisePlanSubscriptionModel> {
    const url = `${this.baseUrl}`;
    return this.http.post<FitwisePlanSubscriptionModel>(url, data);
  }


}
