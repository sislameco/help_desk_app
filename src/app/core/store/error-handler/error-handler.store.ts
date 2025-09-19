import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { errorHandlerInitialState, ErrorHandlerState } from './models/error-handler.state';
import { HttpErrorResponse } from '@angular/common/http';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

export const ErrorHandlerStore = signalStore(
  { providedIn: 'root' },
  withDevtools('AuthStore'),
  withState<ErrorHandlerState>(errorHandlerInitialState),
  withMethods((store) => ({
    handleError401: (error: HttpErrorResponse) => {
      patchState(store, {
        code: error.status,
        message: error.message,
      });
      // router.navigate(['/auth/login']);
    },
    handleError404: (error: HttpErrorResponse) => {
      patchState(store, {
        code: error.status,
        message: error.message,
      });
      // router.navigate(['/']);
    },
  })),
);
