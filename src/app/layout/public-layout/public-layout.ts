import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { RecomendacionIa } from '../../features/adopciones/recomendacion-ia/recomendacion-ia';
import { PLATAFORMA, REDES_SOCIALES } from '../../features/publico/contenido';

interface NavItem {
  label: string;
  link: string;
  exact: boolean;
}

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {
  private readonly dialog = inject(MatDialog);

  readonly menuAbierto = signal(false);
  readonly anio = new Date().getFullYear();
  readonly plataforma = PLATAFORMA;
  readonly redes = REDES_SOCIALES;

  readonly nav: NavItem[] = [
    { label: 'Inicio', link: '/', exact: true },
    { label: 'Mascotas en adopción', link: '/mascotas', exact: false },
    { label: 'Cómo adoptar', link: '/como-adoptar', exact: false },
    { label: 'Asistente', link: '/asistente', exact: false },
    { label: 'Refugios', link: '/refugios', exact: false },
  ];

  toggleMenu(): void {
    this.menuAbierto.update((v) => !v);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  abrirIa(): void {
    this.cerrarMenu();
    this.dialog.open(RecomendacionIa, {
      width: '620px',
      maxWidth: '95vw',
      autoFocus: false,
    });
  }
}
