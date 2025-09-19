import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthStore } from '@core/store/auth-store/auth.store';

export const authInitResolver: ResolveFn<boolean> = () => {
  const authStore = inject(AuthStore);
  authStore.isLogin();
  // just touching the store will trigger onInit()
  return true;
};
