import { inject, signal } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

const activeRequests = signal(0);

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(NgxSpinnerService);

  if (activeRequests() === 0) {
    spinnerService.show().then();
  }

  activeRequests.set(activeRequests() + 1);

  return next(req).pipe(
    finalize(() => {
      activeRequests.set(activeRequests() - 1);

      if (activeRequests() === 0) {
        spinnerService.hide().then();
      }
    }),
  );
};
