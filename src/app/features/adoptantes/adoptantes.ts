import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { SeguimientoService } from '../../core/services/seguimiento.service';
import { AdoptanteSeguimiento } from '../../core/models/seguimiento.model';
import { SeguimientoDialog } from './seguimiento-dialog/seguimiento-dialog';
import { UiPageHeader } from '../../shared/ui/ui-page-header/ui-page-header';
import { UiCard } from '../../shared/ui/ui-card/ui-card';
import { UiEmptyState } from '../../shared/ui/ui-empty-state/ui-empty-state';

@Component({
  selector: 'app-adoptantes',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    UiPageHeader,
    UiCard,
    UiEmptyState,
  ],
  templateUrl: './adoptantes.html',
  styleUrl: './adoptantes.scss',
})
export class Adoptantes implements OnInit {
  private readonly seguimientoService = inject(SeguimientoService);
  private readonly dialog = inject(MatDialog);

  readonly cargando = signal(false);
  readonly adoptantes = signal<AdoptanteSeguimiento[]>([]);

  readonly completados = computed(
    () => this.adoptantes().filter((a) => a.seguimiento_estado === 'COMPLETADO').length
  );
  readonly pendientes = computed(
    () => this.adoptantes().filter((a) => a.seguimiento_estado === 'PENDIENTE').length
  );

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.seguimientoService.listarAdoptantes().subscribe({
      next: (res) => {
        this.adoptantes.set(res.data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  /** Etiqueta del estado del seguimiento para la píldora. */
  estadoSeguimiento(a: AdoptanteSeguimiento): { texto: string; clase: string; icono: string } {
    if (a.seguimiento_estado === 'COMPLETADO') {
      return { texto: 'Seguimiento recibido', clase: 'estado--ok', icono: 'task_alt' };
    }
    if (a.seguimiento_estado === 'PENDIENTE') {
      return { texto: 'Esperando respuesta', clase: 'estado--pend', icono: 'hourglass_top' };
    }
    return { texto: 'Sin seguimiento', clase: 'estado--none', icono: 'radio_button_unchecked' };
  }

  bienestarTexto(valor: string | null): string {
    switch (valor) {
      case 'BUENO':
        return 'Bueno';
      case 'REGULAR':
        return 'Regular';
      case 'EN_RIESGO':
        return 'En riesgo';
      default:
        return '—';
    }
  }

  bienestarClase(valor: string | null): string {
    switch (valor) {
      case 'BUENO':
        return 'bienestar--bueno';
      case 'REGULAR':
        return 'bienestar--regular';
      case 'EN_RIESGO':
        return 'bienestar--riesgo';
      default:
        return '';
    }
  }

  abrirSeguimiento(a: AdoptanteSeguimiento): void {
    this.dialog
      .open(SeguimientoDialog, {
        data: { adoptante: a },
        width: '560px',
        maxWidth: '95vw',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((cambiado) => {
        if (cambiado) this.cargar();
      });
  }
}
