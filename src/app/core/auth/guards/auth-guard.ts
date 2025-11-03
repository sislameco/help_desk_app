import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '@core/store/auth-store/auth.store';

export const authGuard: CanActivateFn = async (route) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  const { userId, appId, company, authKey } = route.queryParams;
  if (userId && appId) {
    await authStore.loginWithUserId({ userId: +userId, appId: +appId }, company, authKey);
    // const cleanUrl = state.url.split('?')[0];
    // router.navigate([cleanUrl], {
    //   queryParams: restParams,
    //   replaceUrl: true,
    // });
  }

  return authStore.isLogin() ? true : router.parseUrl('/auth/login');
};
