import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Keep throwError for now, but we'll discuss alternatives
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlerStore } from '@core/store/error-handler/error-handler.store'; // Assuming the path to your store

export const errorHandlingInterceptor = (
  request: HttpRequest<unknown>, // Use 'unknown' for better type safety
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  // Use 'unknown' here as well
  const errorHandlerStore = inject(ErrorHandlerStore);
  const toastr = inject(ToastrService);

  return next(request).pipe(
    catchError((error: unknown) => {
      // Explicitly type 'error' as 'unknown'
      if (error instanceof HttpErrorResponse) {
        toastr.error(error.error.message, error.error.title);
        switch (error.status) {
          case 401:
            errorHandlerStore.handleError401(error);
            return throwError(() => error); // Modern way to use throwError
          case 404:
            errorHandlerStore.handleError404(error);
            // Re-throw the error after handling
            return throwError(() => error); // Modern way to use throwError
          case 400:
            errorHandlerStore.handleError400(error);
            // Re-throw the error after handling
            return throwError(() => error); // Modern way to use throwError
          case 500:
            errorHandlerStore.handleError500(error);
            return throwError(() => error); // Modern way to use throwError
          default:
            // For other HTTP errors, re-throw them directly
            return throwError(() => error); // Modern way to use throwError
        }
      } else {
        // If it's not an HttpErrorResponse, re-throw it directly
        return throwError(() => error); // Modern way to use throwError
      }
    }),
  );
};
