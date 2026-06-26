import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguimientoService } from '../../../core/services/seguimiento.service';
import {
  AdoptanteSeguimiento,
  ESTADOS_BIENESTAR,
  FRECUENCIAS_ALIMENTACION,
  NIVELES_ACTIVIDAD,
  etiquetaSeguimiento,
} from '../../../core/models/seguimiento.model';

export interface SeguimientoDialogData {
  adoptante: AdoptanteSeguimiento;
}

@Component({
  selector: 'app-seguimiento-dialog',
  imports: [
    DatePipe,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './seguimiento-dialog.html',
  styleUrl: './seguimiento-dialog.scss',
})
export class SeguimientoDialog {
  private readonly data = inject<SeguimientoDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SeguimientoDialog>);
  private readonly seguimientoService = inject(SeguimientoService);
  private readonly snackBar = inject(MatSnackBar);

  readonly adoptante = this.data.adoptante;

  readonly generando = signal(false);
  readonly cambiado = signal(false);
  /** Token del enlace (puede venir de la lista o generarse aquí). */
  readonly token = signal<string | null>(this.data.adoptante.token);
  readonly estado = signal(this.data.adoptante.seguimiento_estado);

  readonly enlace = computed(() => {
    const t = this.token();
    if (!t) return '';
    const origen = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origen}/seguimiento/${t}`;
  });

  generar(): void {
    this.generando.set(true);
    this.seguimientoService.generarEnlace(this.adoptante.solicitud_id).subscribe({
      next: (res) => {
        this.generando.set(false);
        this.token.set(res.data.token);
        this.estado.set(res.data.estado);
        this.cambiado.set(true);
        this.snackBar.open('Enlace de seguimiento generado', 'Cerrar', { duration: 3000 });
      },
      error: () => this.generando.set(false),
    });
  }

  copiar(): void {
    const url = this.enlace();
    if (!url) return;
    navigator.clipboard?.writeText(url).then(
      () => this.snackBar.open('Enlace copiado al portapapeles', 'Cerrar', { duration: 2500 }),
      () => this.snackBar.open('No se pudo copiar el enlace', 'Cerrar', { duration: 2500 })
    );
  }

  compartirWhatsApp(): void {
    const a = this.adoptante;
    const texto = encodeURIComponent(
      `Hola ${a.adoptante_nombre} 🐾, somos ${a.refugio_nombre}. ` +
        `Queremos saber cómo está ${a.mascota_nombre}. ` +
        `Por favor diligencia este seguimiento: ${this.enlace()}`
    );
    window.open(`https://wa.me/?text=${texto}`, '_blank', 'noopener');
  }

  compartirEmail(): void {
    const a = this.adoptante;
    if (!a.adoptante_email) return;
    const asunto = encodeURIComponent(`Seguimiento de ${a.mascota_nombre} · ${a.refugio_nombre}`);
    const cuerpo = encodeURIComponent(
      `Hola ${a.adoptante_nombre},\n\nNos encantaría saber cómo está ${a.mascota_nombre} ` +
        `desde que llegó a tu hogar. Por favor diligencia este breve formulario de seguimiento:\n\n` +
        `${this.enlace()}\n\n¡Gracias por adoptar responsablemente!\n${a.refugio_nombre}`
    );
    window.location.href = `mailto:${a.adoptante_email}?subject=${asunto}&body=${cuerpo}`;
  }

  // ---- Resumen de la respuesta (estado COMPLETADO) ----
  frecuencia(valor: string | null): string {
    return etiquetaSeguimiento(FRECUENCIAS_ALIMENTACION, valor);
  }
  bienestar(valor: string | null): string {
    return etiquetaSeguimiento(ESTADOS_BIENESTAR, valor);
  }
  actividad(valor: string | null): string {
    return etiquetaSeguimiento(NIVELES_ACTIVIDAD, valor);
  }
  si(v: boolean | null): string {
    return v ? 'Sí' : 'No';
  }

  cerrar(): void {
    this.dialogRef.close(this.cambiado());
  }
}
