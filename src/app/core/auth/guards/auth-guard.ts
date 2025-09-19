import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '@core/store/auth-store/auth.store';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  return authStore.isLogin() ? true : router.parseUrl('/auth/login');
};
