import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '@core/auth/models/user.model';
import { UserMenuItem } from '@core/layout/pages/authorized-layout/authorized-sidebar/sidebar-data-type';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  signOut(): Observable<boolean> {
    return this.http.get<boolean>(environment.apiBaseUrl + '/api/helpdesk/sign-out');
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(environment.apiBaseUrl + '/api/helpdesk/login', data);
  }

  refreshToken(token: string): Observable<{ token: string; refreshToken: string }> {
    return this.http.post<{ token: string; refreshToken: string }>(
      environment.apiBaseUrl + '/api/helpdesk/refresh-token?token=' + token,
      {},
    );
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
  setNewPassword(userToken: string, newPassword: string, userId: number) {
    return this.http.post<{ data: string }>(
      `${environment.apiBaseUrl}/api/helpdesk/change-password/${userId}`,
      {
        userToken,
        newPassword,
      },
    );
  }

  loginWithUserId(
    data: { userId: number; appId: number },
    company: string,
    authKey: string,
  ): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      company,
      AuthorizationKey: authKey,
    });
    return this.http.post<LoginResponse>(
      environment.apiBaseUrl + '/api/helpdesk/embedded-login',
      data,
      { headers },
    );
  }
}
