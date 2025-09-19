import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '@core/auth/models/user.model';
import { MenuItem } from '@core/layout/pages/authorized-layout/authorized-sidebar/sidebar-data-type';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', data);
  }
  getSidebarItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(environment.apiBaseUrl + '/api/sidebar-items');
  }
}
