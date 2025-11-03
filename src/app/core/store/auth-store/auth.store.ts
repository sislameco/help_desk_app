import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { signalStore, withState, withMethods, withHooks, patchState } from '@ngrx/signals';
import { LoginRequest, LoginResponse } from '@core/auth/models/user.model';
import { CookieService } from '@core/services/cookie.service';
import { LocalStorageService } from '@core/services/local-storage.service';
import { AuthService } from '@core/auth/services/auth.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, tap } from 'rxjs';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { ToastrService } from 'ngx-toastr';
import { UserMenuItem } from '@core/layout/pages/authorized-layout/authorized-sidebar/sidebar-data-type';

export interface AuthState {
  isLogin: boolean;
  userInfo: LoginResponse['user'] | null;
  token: string;
  menus: UserMenuItem[];
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withDevtools('AuthStore'),
  withState<AuthState>({
    isLogin: false,
    userInfo: null,
    token: '',
    menus: [],
  }),
  withMethods((store) => {
    const cookieService = inject(CookieService);
    const localStorage = inject(LocalStorageService);
    const router = inject(Router);
    const toastr = inject(ToastrService);
    const authService = inject(AuthService);

    return {
      /**
       * Login using rxMethod (Angular 20+ best practice)
       */
      login: rxMethod<LoginRequest>(
        exhaustMap((credentials: LoginRequest) =>
          authService.login(credentials).pipe(
            tap({
              next: (response: LoginResponse) => {
                localStorage.setItem('auth_token', response.token);
                cookieService.setCookie('hd_token', response.token);
                cookieService.setCookie('hd_refreshToken', response.refreshToken);
                localStorage.setItem('hd_user', JSON.stringify(response.user));
                patchState(store, {
                  isLogin: true,
                  userInfo: response.user,
                  token: response.token,
                  menus: [],
                });
                toastr.success('Login successful');
                router.navigateByUrl('/');
              },
              error: () => {
                // handled globally
              },
            }),
          ),
        ),
      ),

      /**
       * Set user info manually
       */
      setUserInfo(user: LoginResponse['user'] | null) {
        patchState(store, { userInfo: user });
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      },
      /**
       * Login with userId (impersonation or SSO)
       */
      async loginWithUserId(
        params: { userId: number; appId: number },
        company: string,
        authKey: string,
      ) {
        // Call API to get token
        const response = await authService.loginWithUserId(params, company, authKey).toPromise();
        const token = response?.token;
        if (token) {
          localStorage.setItem('auth_token', token);
          cookieService.setCookie('hd_token', token);
          cookieService.setCookie('hd_refreshToken', response.refreshToken);
          patchState(store, { isLogin: true, token });
        }
      },
      async refreshToken(refreshToken: string) {
        // Call API to get token
        const response = await authService.refreshToken(refreshToken).toPromise();
        const token = response?.token;
        if (token) {
          localStorage.setItem('auth_token', token);
          cookieService.setCookie('hd_token', token);
          cookieService.setCookie('hd_refreshToken', response.refreshToken);
          patchState(store, { isLogin: true, token });
        }
        return token as string;
      },
      /**
       * Logout user
       */
      logout() {
        cookieService.removeCookie('hd_token');
        cookieService.removeCookie('hd_refreshToken');
        localStorage.clear();
        patchState(store, { isLogin: false, userInfo: null, token: '' });
        router.navigateByUrl('/auth/login');
      },
      updateMenus(menus: UserMenuItem[]) {
        patchState(store, {
          menus,
        });
      },
    };
  }),
  withHooks({
    onInit(store) {
      const cookieService = inject(CookieService);
      const localStorage = inject(LocalStorageService);

      const token = cookieService.getCookie('hd_token');
      const user = localStorage.getItem<LoginResponse['user'] | null>('hd_user');

      if (token && user) {
        store.setUserInfo(user);
        patchState(store, {
          token,
          isLogin: true,
        });
      }
    },
  }),
);
