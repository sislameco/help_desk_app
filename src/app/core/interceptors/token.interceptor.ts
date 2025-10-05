import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService } from '@core/services/local-storage.service';

// Replace with your actual static token
//const STATIC_BEARER_TOKEN =
// 'eyJhbGciOiJIUzI1NiIsImtpZCI6ImsxIiwidHlwIjoiSldUIn0.eyJwYXlsb2FkIjoie1widXNlclwiOntcIklkXCI6NixcIlBhc3N3b3JkSGFzaFwiOlwiWXFPZFxcdTAwMkJIdFFHdFFMYjhGRmdnZFd6TzNLdVZMR1JpYVdqb1BNdXVXXFx1MDAyQnJtTT1cIixcIk5hbWVcIjpcIlN1cGVyIEFkbWluXCIsXCJFbWFpbFwiOlwic3VwZXJhZG1pbkBtYXRlcmlhbHNkaXJlY3QuaWVcIn19IiwidXNlcklkIjoiNiIsImp0aSI6ImM3NTYxNzFjLTc5ZmUtNGRjZi04OGVkLTg4ODM2MGRkZDA3MSIsImV4cFVuaXgiOiIxNzU4MzUwOTQ2IiwiZXhwIjoxNzU4MzUwOTQ2LCJpc3MiOiJodHRwczovL2F1dGgucGYubG9jYWwiLCJhdWQiOiJwZi1nYXRld2F5In0.PZLuXBeY9-Q-oRZNAdrCbtW1o35Ao3Akj8LkBe-9_Tk';

/**
 * Adds a static Bearer token to outgoing HTTP requests.
 * Skips requests for assets and those that already have an Authorization header.
 */
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorage = inject(LocalStorageService);

  const isAsset = req.url.startsWith('/assets') || req.url.startsWith('assets/');
  const hasAuthHeader = req.headers.has('Authorization');
  if (isAsset || hasAuthHeader) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    }),
  );
};
