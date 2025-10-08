import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { errorHandlerInitialState, ErrorHandlerState } from './models/error-handler.state';
import { HttpErrorResponse } from '@angular/common/http';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

export const ErrorHandlerStore = signalStore(
  { providedIn: 'root' },
  withDevtools('ErrorHandlerStore'),
  withState<ErrorHandlerState>(errorHandlerInitialState),
  withMethods((store) => {
    const extractMessage = (error: HttpErrorResponse): string => {
      if (error.error?.Message) {
        return error.error.Message;
      } // Capital M from your backend
      if (error.error?.message) {
        return error.error.message;
      }
      if (error.error?.errors) {
        return Object.values(error.error.errors).flat().join(' | ');
      }
      if (typeof error.error === 'string') {
        return error.error;
      }
      return error.message || 'Unexpected server error';
    };

    const updateState = (error: HttpErrorResponse) => {
      patchState(store, {
        code: error.status,
        message: extractMessage(error),
      });
    };

    return {
      handleError400: updateState,
      handleError401: updateState,
      handleError404: updateState,
      handleError500: updateState,
      handleDefaultError: updateState,
      clearError: () =>
        patchState(store, {
          code: undefined,
          message: undefined,
        }),
    };
  }),
);
