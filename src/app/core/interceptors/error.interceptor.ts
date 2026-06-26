import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

/** Muestra los errores HTTP del backend mediante un snackbar de Material. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error) => {
      const mensaje =
        error?.error?.message || 'Ocurrio un error inesperado. Intenta de nuevo.';

      // No notificar la hidratacion silenciosa del perfil (/me).
      if (!req.url.endsWith('/me')) {
        snackBar.open(mensaje, 'Cerrar', { duration: 4000 });
      }

      return throwError(() => error);
    })
  );
};
