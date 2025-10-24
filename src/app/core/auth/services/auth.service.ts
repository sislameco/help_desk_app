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
  forgetPassword(userName: string) {
    return this.http.post<{ data: string }>(
      `${environment.apiBaseUrl}/api/helpdesk/forgot-password`,
      {
        userName,
      },
    );
  }

  verifyOtp(code: string, userToken: string) {
    return this.http.post<{ data: string }>(
      `${environment.apiBaseUrl}/api/helpdesk/password-recovery-otp-verification`,
      {
        code,
        userToken,
      },
    );
  }
  setNewPassword(userToken: string, newPassword: string) {
    return this.http.post<{ data: string }>(
      `${environment.apiBaseUrl}/api/helpdesk/reset-password`,
      {
        userToken,
        newPassword,
      },
    );
  }
}
