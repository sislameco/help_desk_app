import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '@core/auth/models/user.model';
import { UserMenuItem } from '@core/layout/pages/authorized-layout/authorized-sidebar/sidebar-data-type';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(environment.apiBaseUrl + '/api/helpdesk/login', data);
  }
  getSidebarItems(): Observable<UserMenuItem[]> {
    return this.http.get<UserMenuItem[]>(environment.apiBaseUrl + '/api/permission/get-menus');
  }
}
