import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter, map } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  link: string;
  roles: string[]; // vacío = visible para todos
  nuevaPestana?: boolean; // abre el enlace en una pestaña nueva (conserva la sesión)
}

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayout {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly bp = inject(BreakpointObserver);
  protected readonly auth = inject(AuthService);

  readonly isHandset = toSignal(
    this.bp.observe('(max-width: 900px)').pipe(map((r) => r.matches)),
    { initialValue: false }
  );

  readonly breadcrumb = signal<string[]>([]);

  readonly menu: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', link: '/panel/inicio', roles: [] },
    { label: 'Refugios', icon: 'home_work', link: '/panel/refugios', roles: ['REFUGIO', 'ADMINISTRADOR'] },
    { label: 'Mascotas', icon: 'pets', link: '/panel/mascotas', roles: ['REFUGIO', 'ADMINISTRADOR'] },
    { label: 'Explorar adopción', icon: 'volunteer_activism', link: '/mascotas', roles: [], nuevaPestana: true },
    { label: 'Solicitudes recibidas', icon: 'inbox', link: '/panel/solicitudes-recibidas', roles: ['REFUGIO', 'ADMINISTRADOR'] },
    { label: 'Adoptantes', icon: 'diversity_1', link: '/panel/adoptantes', roles: ['REFUGIO', 'ADMINISTRADOR'] },
    { label: 'Peticiones de auxilio', icon: 'sos', link: '/panel/peticiones-auxilio', roles: ['REFUGIO', 'ADMINISTRADOR'] },
    { label: 'Mi perfil', icon: 'person', link: '/panel/perfil', roles: [] },
  ];

  private readonly rolLabels: Record<string, string> = {
    ADMINISTRADOR: 'Administrador',
    REFUGIO: 'Refugio',
    PROPIETARIO: 'Propietario',
    ADOPTANTE: 'Adoptante',
  };

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.actualizarBreadcrumb());
    setTimeout(() => this.actualizarBreadcrumb());
  }

  private actualizarBreadcrumb(): void {
    let r: ActivatedRoute | null = this.route;
    const crumb: string[] = [];
    while (r) {
      const b = r.snapshot?.data?.['breadcrumb'] as string[] | undefined;
      if (b?.length) {
        crumb.length = 0;
        crumb.push(...b);
      }
      r = r.firstChild;
    }
    this.breadcrumb.set(crumb);
  }

  puedeVer(item: MenuItem): boolean {
    if (item.roles.length === 0) return true;
    return item.roles.some((rol) => this.auth.hasRole(rol));
  }

  get usuario() {
    return this.auth.usuario;
  }

  iniciales(): string {
    const u = this.auth.usuario();
    if (!u) return '?';
    const txt = (u.nombre?.[0] ?? '') + (u.apellido?.[0] ?? '');
    return txt.toUpperCase() || '?';
  }

  rolPrincipal(): string {
    const rol = this.auth.usuario()?.roles?.[0];
    return rol ? this.rolLabels[rol] ?? rol : '';
  }

  cerrarSesion(): void {
    this.auth.logout();
  }
}
