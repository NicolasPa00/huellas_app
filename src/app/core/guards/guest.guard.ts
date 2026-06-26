import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

/** Bloquea las pantallas de auth si el usuario ya tiene sesion. */
export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokens = inject(TokenService);

  if (tokens.accessToken) {
    return router.createUrlTree(['/panel/inicio']);
  }
  return true;
};
