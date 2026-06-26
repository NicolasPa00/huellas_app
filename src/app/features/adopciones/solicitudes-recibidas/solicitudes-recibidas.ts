import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdopcionService } from '../../../core/services/adopcion.service';
import { UiConfirmDialog, ConfirmDialogData } from '../../../shared/ui/ui-confirm-dialog/ui-confirm-dialog';
import {
  AccionResolucion,
  FormularioAdopcion,
  SolicitudRecibida,
} from '../../../core/models/adopcion.model';
import { estadoSolicitudClase } from '../estado-solicitud.util';
import {
  TIPO_DUENIO,
  TIPO_VIVIENDA,
  HORAS_FUERA,
  EXPERIENCIA,
  etiquetaDe,
} from '../adopcion-opciones';
import { UiPageHeader } from '../../../shared/ui/ui-page-header/ui-page-header';
import { UiCard } from '../../../shared/ui/ui-card/ui-card';
import { UiEmptyState } from '../../../shared/ui/ui-empty-state/ui-empty-state';

@Component({
  selector: 'app-solicitudes-recibidas',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    UiPageHeader,
    UiCard,
    UiEmptyState,
  ],
  templateUrl: './solicitudes-recibidas.html',
  styleUrl: './solicitudes-recibidas.scss',
})
export class SolicitudesRecibidas implements OnInit {
  private readonly adopcionService = inject(AdopcionService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  readonly cargando = signal(false);
  readonly procesando = signal<number | null>(null);
  readonly solicitudes = signal<SolicitudRecibida[]>([]);

  readonly estadoClase = estadoSolicitudClase;

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.adopcionService.listarRecibidas().subscribe({
      next: (res) => {
        this.solicitudes.set(res.data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  resolver(s: SolicitudRecibida, accion: AccionResolucion): void {
    const config: Record<AccionResolucion, ConfirmDialogData> = {
      APROBAR: {
        titulo: '¡Aprobar adopción!',
        mensaje: `Vas a aprobar la solicitud de ${s.adoptante_nombre} para ${s.mascota_nombre}. Le daremos una alegría a esta huella. 🐾`,
        confirmar: 'Sí, aprobar',
        icono: 'volunteer_activism',
        tono: 'success',
      },
      RECHAZAR: {
        titulo: '¿Rechazar solicitud?',
        mensaje: `Se rechazará la solicitud de ${s.adoptante_nombre}. Podrás revisar otras candidaturas para ${s.mascota_nombre}.`,
        confirmar: 'Rechazar',
        icono: 'pets',
        tono: 'warn',
      },
      COMPLETAR: {
        titulo: '¡Confirmar adopción!',
        mensaje: `${s.mascota_nombre} encontrará un hogar. Esto cerrará las demás solicitudes de esta mascota.`,
        confirmar: 'Confirmar adopción',
        icono: 'home',
        tono: 'success',
      },
    };

    this.dialog
      .open(UiConfirmDialog, { data: config[accion], width: '440px', maxWidth: '92vw', autoFocus: false })
      .afterClosed()
      .subscribe((ok) => {
        if (ok) this.ejecutar(s, accion);
      });
  }

  private ejecutar(s: SolicitudRecibida, accion: AccionResolucion): void {
    this.procesando.set(s.id);
    this.adopcionService.resolver(s.id, accion).subscribe({
      next: (res) => {
        this.procesando.set(null);
        this.snackBar.open('Solicitud actualizada', 'Cerrar', { duration: 3000 });
        this.solicitudes.set(
          this.solicitudes().map((x) =>
            x.id === s.id
              ? { ...x, estado_codigo: res.data.estado_codigo, estado: res.data.estado }
              : x
          )
        );
      },
      error: () => this.procesando.set(null),
    });
  }

  puntaje(valor: number | string | null): number | null {
    return valor == null ? null : Number(valor);
  }

  private si(v: boolean): string {
    return v ? 'Sí' : 'No';
  }

  /** Convierte el cuestionario en pares etiqueta/valor legibles para el refugio. */
  detalleFormulario(f: FormularioAdopcion): { etiqueta: string; valor: string }[] {
    const filas: { etiqueta: string; valor: string }[] = [
      { etiqueta: 'Tipo de dueño/vivienda', valor: etiquetaDe(TIPO_DUENIO, f.tipo_duenio) },
      { etiqueta: 'Dirección', valor: f.direccion_residencia || '—' },
      { etiqueta: 'Tipo de vivienda', valor: etiquetaDe(TIPO_VIVIENDA, f.tipo_vivienda) },
      { etiqueta: 'Espacios al aire libre', valor: this.si(f.espacios_aire_libre) },
      { etiqueta: 'Horas fuera de casa', valor: etiquetaDe(HORAS_FUERA, f.horas_fuera) },
      {
        etiqueta: 'Otros animales',
        valor: f.otros_animales ? `Sí${f.otros_animales_detalle ? ' · ' + f.otros_animales_detalle : ''}` : 'No',
      },
      {
        etiqueta: 'Niños en el hogar',
        valor: f.hay_ninos ? `Sí${f.ninos_edades ? ' · ' + f.ninos_edades : ''}` : 'No',
      },
      { etiqueta: 'Experiencia previa', valor: etiquetaDe(EXPERIENCIA, f.experiencia) },
      { etiqueta: 'Cubre gastos vet./alimentación', valor: this.si(f.cubre_gastos) },
      { etiqueta: 'Tiempo para paseos', valor: this.si(f.tiempo_paseos) },
      { etiqueta: 'Acepta adopción responsable', valor: this.si(f.acepta_terminos) },
      { etiqueta: 'Compromiso de esterilización', valor: this.si(f.compromiso_esterilizacion) },
      { etiqueta: 'Autoriza seguimiento', valor: this.si(f.autoriza_seguimiento) },
    ];
    return filas;
  }
}
