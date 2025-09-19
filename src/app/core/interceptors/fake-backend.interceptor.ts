import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoginRequest, LoginResponse } from '@core/auth/models/user.model';

export const fakeBackendInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  if (req.url.includes('/api/auth/login') && req.method === 'POST') {
    const { email, password } = req.body as LoginRequest;
    if (email === 'test@example.com' && password === 'Password@123') {
      const token = generateBearerToken();

      const response: LoginResponse = {
        token,
        user: { email: 'test@example.com', name: 'Test User' },
      };

      return of(
        new HttpResponse<LoginResponse>({
          status: 200,
          body: response,
        }),
      ).pipe(delay(500));
    } else {
      return throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            error: { message: 'Invalid email or password' },
          }),
      ).pipe(delay(500));
    }
  }

  return next(req);
};

// ---- helper function ----
function generateBearerToken(): string {
  // mimic JWT structure: header.payload.signature
  return `${randomSegment(16)}.${randomSegment(32)}.${randomSegment(32)}`;
}

function randomSegment(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let segment = '';
  for (let i = 0; i < length; i++) {
    segment += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return segment;
}
