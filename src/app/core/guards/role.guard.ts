import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Restringe el acceso por rol. Se configura con `data: { roles: [...] }`
 * en la definicion de la ruta. Listo para las fases que requieran RBAC.
 */
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const rolesRequeridos = (route.data?.['roles'] as string[]) ?? [];
  if (rolesRequeridos.length === 0) {
    return true;
  }
  if (rolesRequeridos.some((rol) => auth.hasRole(rol))) {
    return true;
  }
  return router.createUrlTree(['/panel/inicio']);
};
