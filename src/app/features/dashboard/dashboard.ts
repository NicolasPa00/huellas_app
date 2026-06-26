import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { UiStatCard, StatTone } from '../../shared/ui/ui-stat-card/ui-stat-card';
import { UiCard } from '../../shared/ui/ui-card/ui-card';
import { UiPageHeader } from '../../shared/ui/ui-page-header/ui-page-header';

interface Stat {
  icono: string;
  valor: string;
  etiqueta: string;
  tendencia: string;
  tono: StatTone;
}

interface AccesoRapido {
  icono: string;
  titulo: string;
  descripcion: string;
  link: string;
  tono: StatTone;
}

interface Actividad {
  icono: string;
  texto: string;
  tiempo: string;
  tono: StatTone;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatIconModule, MatButtonModule, UiStatCard, UiCard, UiPageHeader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly auth = inject(AuthService);
  readonly usuario = this.auth.usuario;

  // Datos simulados para demostrar la experiencia final.
  readonly stats: Stat[] = [
    { icono: 'pets', valor: '128', etiqueta: 'Mascotas registradas', tendencia: '+12 este mes', tono: 'primary' },
    { icono: 'favorite', valor: '43', etiqueta: 'Adopciones exitosas', tendencia: '+5 esta semana', tono: 'secondary' },
    { icono: 'home_work', valor: '17', etiqueta: 'Refugios activos', tendencia: '+2 este mes', tono: 'info' },
    { icono: 'chat', valor: '92', etiqueta: 'Consultas de comportamiento', tendencia: '+18 este mes', tono: 'warning' },
  ];

  readonly accesos: AccesoRapido[] = [
    { icono: 'home_work', titulo: 'Refugios', descripcion: 'Gestiona tus refugios y su información', link: '/panel/refugios', tono: 'primary' },
    { icono: 'pets', titulo: 'Mascotas', descripcion: 'Registra y administra mascotas', link: '/panel/mascotas', tono: 'secondary' },
    { icono: 'person', titulo: 'Mi perfil', descripcion: 'Datos personales y preferencias', link: '/panel/perfil', tono: 'info' },
  ];

  readonly actividad: Actividad[] = [
    { icono: 'pets', texto: 'Nueva mascota registrada: "Luna"', tiempo: 'Hace 2 h', tono: 'primary' },
    { icono: 'favorite', texto: 'Adopción aprobada para "Max"', tiempo: 'Hace 5 h', tono: 'secondary' },
    { icono: 'home_work', texto: 'Refugio "Patitas Felices" verificado', tiempo: 'Ayer', tono: 'info' },
    { icono: 'chat', texto: 'Consulta de comportamiento resuelta', tiempo: 'Ayer', tono: 'warning' },
  ];

  // Distribución simulada por especie para la mini-gráfica.
  readonly distribucion = [
    { etiqueta: 'Perros', porcentaje: 64 },
    { etiqueta: 'Gatos', porcentaje: 31 },
    { etiqueta: 'Otros', porcentaje: 5 },
  ];
}
