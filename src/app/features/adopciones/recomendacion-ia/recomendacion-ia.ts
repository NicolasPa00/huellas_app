import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PublicoService } from '../../../core/services/publico.service';
import {
  PerfilIA,
  RecomendacionMascota,
  RecomendacionResponse,
} from '../../../core/models/adopcion.model';
import { TIPO_VIVIENDA, HORAS_FUERA, EXPERIENCIA } from '../adopcion-opciones';
import { SolicitudForm } from '../solicitud-form/solicitud-form';
import { edadTexto } from '../../mascotas/edad.util';

@Component({
  selector: 'app-recomendacion-ia',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressBarModule,
  ],
  templateUrl: './recomendacion-ia.html',
  styleUrl: './recomendacion-ia.scss',
})
export class RecomendacionIa {
  private readonly fb = inject(FormBuilder);
  private readonly publicoService = inject(PublicoService);
  private readonly dialog = inject(MatDialog);
  private readonly dialogRef = inject(MatDialogRef<RecomendacionIa>);
  private readonly router = inject(Router);

  readonly analizando = signal(false);
  readonly resultado = signal<RecomendacionResponse | null>(null);

  readonly tipoViviendaOpts = TIPO_VIVIENDA;
  readonly horasFueraOpts = HORAS_FUERA;
  readonly experienciaOpts = EXPERIENCIA;

  readonly form = this.fb.nonNullable.group({
    tipo_vivienda: ['', [Validators.required]],
    espacios_aire_libre: [false],
    horas_fuera: ['', [Validators.required]],
    experiencia: ['', [Validators.required]],
    hay_ninos: [false],
    otros_animales: [false],
  });

  analizar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const perfil: PerfilIA = {
      tipo_vivienda: v.tipo_vivienda as PerfilIA['tipo_vivienda'],
      espacios_aire_libre: v.espacios_aire_libre,
      horas_fuera: v.horas_fuera as PerfilIA['horas_fuera'],
      experiencia: v.experiencia as PerfilIA['experiencia'],
      hay_ninos: v.hay_ninos,
      otros_animales: v.otros_animales,
    };
    this.analizando.set(true);
    this.publicoService.recomendar(perfil).subscribe({
      next: (res) => {
        this.resultado.set(res.data);
        this.analizando.set(false);
      },
      error: () => this.analizando.set(false),
    });
  }

  volver(): void {
    this.resultado.set(null);
  }

  edad(meses: number | null): string {
    return edadTexto(meses);
  }

  verDatos(rec: RecomendacionMascota): void {
    this.dialogRef.close();
    this.router.navigate(['/mascotas', rec.id]);
  }

  adoptar(rec: RecomendacionMascota): void {
    // Precarga el cuestionario con lo ya respondido en el asistente.
    const v = this.form.getRawValue();
    this.dialog.open(SolicitudForm, {
      data: {
        mascotaId: rec.id,
        mascotaNombre: rec.nombre,
        refugioNombre: rec.refugio_nombre,
        prefill: {
          tipo_vivienda: v.tipo_vivienda,
          espacios_aire_libre: v.espacios_aire_libre,
          horas_fuera: v.horas_fuera,
          experiencia: v.experiencia,
          hay_ninos: v.hay_ninos,
          otros_animales: v.otros_animales,
        },
      },
      width: '560px',
      maxWidth: '95vw',
      autoFocus: false,
    });
  }
}
