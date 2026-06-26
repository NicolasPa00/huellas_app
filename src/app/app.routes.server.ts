import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Render en cliente: el flujo de autenticacion depende de estado del
    // navegador (localStorage), por lo que no se prerenderiza en servidor.
    path: '**',
    renderMode: RenderMode.Client
  }
];
