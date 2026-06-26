import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

/** Adjunta el access token (Bearer) a cada peticion saliente si existe. */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenService).accessToken;

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req);
};
