import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PublicoService } from '../../../core/services/publico.service';
import { EstadisticasPublicas, MascotaPublica, RefugioPublico } from '../../../core/models/publico.model';
import { RecomendacionIa } from '../../adopciones/recomendacion-ia/recomendacion-ia';
import { edadTexto } from '../../mascotas/edad.util';
import { aniosDesde, mesesDeMascota, ubicacionTexto } from '../publico.util';
import { PASOS_ADOPCION, TESTIMONIOS } from '../contenido';
import { UiCard } from '../../../shared/ui/ui-card/ui-card';
import { UiStatCard } from '../../../shared/ui/ui-stat-card/ui-stat-card';

@Component({
  selector: 'app-home-publico',
  imports: [RouterLink, MatButtonModule, MatIconModule, UiCard, UiStatCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePublico implements OnInit {
  private readonly publicoService = inject(PublicoService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly stats = signal<EstadisticasPublicas | null>(null);
  readonly destacadas = signal<MascotaPublica[]>([]);
  readonly refugios = signal<RefugioPublico[]>([]);

  readonly pasos = PASOS_ADOPCION;
  readonly testimonios = TESTIMONIOS;

  // Contenido meramente informativo (visión a futuro · no implementado).
  readonly trazabilidad = [
    {
      icono: 'fingerprint',
      titulo: 'Identidad única',
      texto: 'Cada mascota tendría un identificador biométrico irrepetible asociado a su historia.',
    },
    {
      icono: 'travel_explore',
      titulo: 'Trazabilidad real',
      texto: 'Seguimiento confiable del animal a lo largo de toda su vida: origen, adopción y cuidados.',
    },
    {
      icono: 'verified_user',
      titulo: 'Recuperación ágil',
      texto: 'En caso de pérdida o robo, el chip/tatuaje facilitaría reunir a la mascota con su familia.',
    },
    {
      icono: 'gpp_good',
      titulo: 'Menos abandono',
      texto: 'La identificación responsabiliza la tenencia y desincentiva el abandono.',
    },
  ];

  // Marco normativo que respalda iniciativas de bienestar, registro e identificación.
  readonly marcoLegal = [
    {
      norma: 'Ley 84 de 1989',
      detalle: 'Estatuto Nacional de Protección de los Animales: deberes de cuidado y trato digno.',
    },
    {
      norma: 'Ley 1774 de 2016',
      detalle: 'Reconoce a los animales como seres sintientes y tipifica el maltrato como delito.',
    },
    {
      norma: 'Ley 1801 de 2016',
      detalle: 'Código de Seguridad y Convivencia: tenencia responsable y registro de animales de compañía.',
    },
    {
      norma: 'Políticas públicas territoriales',
      detalle:
        'Programas de bienestar animal (nacionales y municipales, como en Pasto) y proyectos de ley que impulsan el censo, registro e identificación con microchip.',
    },
  ];

  ngOnInit(): void {
    this.publicoService.estadisticas().subscribe({ next: (res) => this.stats.set(res.data) });
    this.publicoService.mascotas().subscribe({
      next: (res) => this.destacadas.set(res.data.slice(0, 4)),
    });
    this.publicoService.refugios().subscribe({
      next: (res) => this.refugios.set(res.data.slice(0, 3)),
    });
  }

  abrirIa(): void {
    this.dialog.open(RecomendacionIa, { width: '620px', maxWidth: '95vw', autoFocus: false });
  }

  verPerfil(m: MascotaPublica): void {
    this.router.navigate(['/mascotas', m.id]);
  }

  edad(m: MascotaPublica): string {
    return edadTexto(mesesDeMascota(m));
  }

  ubicacion(m: MascotaPublica): string {
    return ubicacionTexto(m.refugio_ciudad, m.refugio_departamento);
  }

  aniosRefugio(r: RefugioPublico): number {
    return aniosDesde(r.fecha_creacion);
  }
}
