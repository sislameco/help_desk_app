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

export interface AuthState {
  isLogin: boolean;
  userInfo: LoginResponse['user'] | null;
  token: string;
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withDevtools('AuthStore'),
  withState<AuthState>({
    isLogin: false,
    userInfo: null,
    token: '',
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
                cookieService.setCookie('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                patchState(store, {
                  isLogin: true,
                  userInfo: response.user,
                  token: response.token,
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
       * Logout user
       */
      logout() {
        cookieService.removeCookie('token');
        localStorage.clear();
        patchState(store, { isLogin: false, userInfo: null, token: '' });
        router.navigateByUrl('/auth/login');
      },
    };
  }),
  withHooks({
    onInit(store) {
      const cookieService = inject(CookieService);
      const localStorage = inject(LocalStorageService);

      const token = cookieService.getCookie('token');
      const user = localStorage.getItem<LoginResponse['user'] | null>('user');

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
