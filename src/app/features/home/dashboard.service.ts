import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardResponse } from '../user-management/models/dashboard.model';

export interface TicketOutPutDto {
  Opens: number;
  Recent: number;
  Views: number;
  // Add other properties as needed
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private readonly http: HttpClient) {}

  getTicketSummary(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(environment.apiBaseUrl + '/api/dashboard/user-data');
  }
}
