import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  // ---- Pantallas de autenticación (solo invitados, sin shell) ----
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'forgot-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password').then(
        (m) => m.ForgotPassword
      ),
  },
  {
    path: 'reset-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password').then(
        (m) => m.ResetPassword
      ),
  },

  // ---- Panel autenticado (shell con sidebar + header, protegido) ----
  {
    path: 'panel',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/app-layout/app-layout').then((m) => m.AppLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        data: { breadcrumb: ['Dashboard'] },
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'perfil',
        data: { breadcrumb: ['Usuarios', 'Perfil'] },
        loadComponent: () => import('./features/perfil/perfil').then((m) => m.Perfil),
      },
      {
        path: 'refugios',
        data: { breadcrumb: ['Refugios', 'Gestión'] },
        loadComponent: () =>
          import('./features/refugios/mis-refugios/mis-refugios').then((m) => m.MisRefugios),
      },
      {
        path: 'mascotas',
        data: { breadcrumb: ['Mascotas', 'Gestión'] },
        loadComponent: () =>
          import('./features/mascotas/mis-mascotas/mis-mascotas').then((m) => m.MisMascotas),
      },
      {
        path: 'solicitudes-recibidas',
        data: { breadcrumb: ['Adopciones', 'Solicitudes recibidas'] },
        loadComponent: () =>
          import('./features/adopciones/solicitudes-recibidas/solicitudes-recibidas').then(
            (m) => m.SolicitudesRecibidas
          ),
      },
      {
        path: 'adoptantes',
        data: { breadcrumb: ['Adopciones', 'Adoptantes'] },
        loadComponent: () =>
          import('./features/adoptantes/adoptantes').then((m) => m.Adoptantes),
      },
      {
        path: 'peticiones-auxilio',
        data: { breadcrumb: ['Asistencia', 'Peticiones de auxilio'] },
        loadComponent: () =>
          import('./features/auxilio/peticiones-auxilio/peticiones-auxilio').then(
            (m) => m.PeticionesAuxilio
          ),
      },
    ],
  },

  // ---- Sitio público de adopción (sin autenticación) ----
  {
    path: '',
    loadComponent: () =>
      import('./layout/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./features/publico/home/home').then((m) => m.HomePublico),
      },
      {
        path: 'mascotas',
        loadComponent: () =>
          import('./features/publico/catalogo-publico/catalogo-publico').then(
            (m) => m.CatalogoPublico
          ),
      },
      {
        path: 'mascotas/:id',
        loadComponent: () =>
          import('./features/publico/mascota-perfil/mascota-perfil').then((m) => m.MascotaPerfil),
      },
      {
        path: 'refugios',
        loadComponent: () =>
          import('./features/publico/refugios-publico/refugios-publico').then(
            (m) => m.RefugiosPublico
          ),
      },
      {
        path: 'refugios/:id',
        loadComponent: () =>
          import('./features/publico/refugio-perfil/refugio-perfil').then((m) => m.RefugioPerfil),
      },
      {
        path: 'como-adoptar',
        loadComponent: () =>
          import('./features/publico/como-adoptar/como-adoptar').then((m) => m.ComoAdoptar),
      },
      {
        path: 'asistente',
        loadComponent: () =>
          import('./features/publico/asistente/asistente').then((m) => m.Asistente),
      },
      {
        path: 'seguimiento/:token',
        loadComponent: () =>
          import('./features/publico/seguimiento-form/seguimiento-form').then(
            (m) => m.SeguimientoForm
          ),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
