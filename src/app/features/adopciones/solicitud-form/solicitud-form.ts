import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublicoService } from '../../../core/services/publico.service';
import { FormularioAdopcion } from '../../../core/models/adopcion.model';
import { TIPO_DUENIO, TIPO_VIVIENDA, HORAS_FUERA, EXPERIENCIA } from '../adopcion-opciones';

export interface SolicitudDialogData {
  mascotaId: number;
  mascotaNombre: string;
  refugioNombre: string;
  /** Valores opcionales para precargar el cuestionario (p. ej. desde el asistente IA). */
  prefill?: Partial<FormularioAdopcion>;
}

@Component({
  selector: 'app-solicitud-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatProgressBarModule,
  ],
  templateUrl: './solicitud-form.html',
  styleUrl: './solicitud-form.scss',
})
export class SolicitudForm {
  private readonly fb = inject(FormBuilder);
  private readonly publicoService = inject(PublicoService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialogRef = inject(MatDialogRef<SolicitudForm>);
  readonly data = inject<SolicitudDialogData>(MAT_DIALOG_DATA);

  readonly enviando = signal(false);

  readonly tipoDuenioOpts = TIPO_DUENIO;
  readonly tipoViviendaOpts = TIPO_VIVIENDA;
  readonly horasFueraOpts = HORAS_FUERA;
  readonly experienciaOpts = EXPERIENCIA;

  readonly form = this.fb.nonNullable.group({
    // Contacto (solicitud publica, sin cuenta)
    contacto_nombre: ['', [Validators.required, Validators.maxLength(120)]],
    contacto_email: ['', [Validators.required, Validators.email]],
    contacto_telefono: ['', [Validators.required, Validators.maxLength(30)]],
    // Datos del solicitante
    tipo_duenio: ['', [Validators.required]],
    direccion_residencia: ['', [Validators.required, Validators.maxLength(200)]],
    tipo_vivienda: ['', [Validators.required]],
    espacios_aire_libre: [false],
    // Estilo de vida
    horas_fuera: ['', [Validators.required]],
    otros_animales: [false],
    otros_animales_detalle: [''],
    hay_ninos: [false],
    ninos_edades: [''],
    // Preferencias y capacidad
    experiencia: ['', [Validators.required]],
    cubre_gastos: [false],
    tiempo_paseos: [false],
    // Compromisos
    acepta_terminos: [false, [Validators.requiredTrue]],
    compromiso_esterilizacion: [false, [Validators.requiredTrue]],
    autoriza_seguimiento: [false, [Validators.requiredTrue]],
    // Mensaje libre
    mensaje: ['', [Validators.maxLength(1000)]],
  });

  constructor() {
    if (this.data.prefill) {
      this.form.patchValue(this.data.prefill as Record<string, unknown>);
    }
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Completa los campos obligatorios y acepta los compromisos', 'Cerrar', {
        duration: 4000,
      });
      return;
    }
    const v = this.form.getRawValue();
    const formulario: FormularioAdopcion = {
      tipo_duenio: v.tipo_duenio as FormularioAdopcion['tipo_duenio'],
      direccion_residencia: v.direccion_residencia,
      tipo_vivienda: v.tipo_vivienda as FormularioAdopcion['tipo_vivienda'],
      espacios_aire_libre: v.espacios_aire_libre,
      horas_fuera: v.horas_fuera as FormularioAdopcion['horas_fuera'],
      otros_animales: v.otros_animales,
      otros_animales_detalle: v.otros_animales ? v.otros_animales_detalle || null : null,
      hay_ninos: v.hay_ninos,
      ninos_edades: v.hay_ninos ? v.ninos_edades || null : null,
      experiencia: v.experiencia as FormularioAdopcion['experiencia'],
      cubre_gastos: v.cubre_gastos,
      tiempo_paseos: v.tiempo_paseos,
      acepta_terminos: v.acepta_terminos,
      compromiso_esterilizacion: v.compromiso_esterilizacion,
      autoriza_seguimiento: v.autoriza_seguimiento,
    };

    this.enviando.set(true);
    this.publicoService
      .crearSolicitud({
        mascota_id: this.data.mascotaId,
        contacto: {
          nombre: v.contacto_nombre,
          email: v.contacto_email,
          telefono: v.contacto_telefono,
        },
        mensaje: v.mensaje || null,
        formulario,
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.snackBar.open('¡Solicitud enviada al refugio!', 'Cerrar', { duration: 3500 });
          this.dialogRef.close(true);
        },
        error: () => this.enviando.set(false),
      });
  }
}
