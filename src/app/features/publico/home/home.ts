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
