import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

/** Permite el acceso solo si existe un token; si no, redirige a /login. */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokens = inject(TokenService);

  if (tokens.accessToken) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
