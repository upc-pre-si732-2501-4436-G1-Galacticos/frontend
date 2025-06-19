import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {TagPlan} from '../model/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagPlanService {
  private base = `${environment.serverBasePath}/plan-tags`;

  constructor(private http: HttpClient) {}

  getTags(): Observable<TagPlan[]> {
    return this.http.get<TagPlan[]>(`${this.base}`);
  }

}
