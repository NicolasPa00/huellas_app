import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeguimientoService } from '../../../core/services/seguimiento.service';
import {
  ESTADOS_BIENESTAR,
  FRECUENCIAS_ALIMENTACION,
  FrecuenciaAlimentacion,
  EstadoBienestar,
  NivelActividad,
  NIVELES_ACTIVIDAD,
  SeguimientoPublico,
} from '../../../core/models/seguimiento.model';

const MAX_FOTOS = 5;
const MAX_BYTES = 2_500_000; // ~2.5 MB por imagen

@Component({
  selector: 'app-seguimiento-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './seguimiento-form.html',
  styleUrl: './seguimiento-form.scss',
})
export class SeguimientoForm implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly seguimientoService = inject(SeguimientoService);
  private readonly snackBar = inject(MatSnackBar);

  readonly cargando = signal(true);
  readonly enviando = signal(false);
  readonly enviado = signal(false);
  readonly noValido = signal(false);
  readonly yaCompletado = signal(false);

  readonly seguimiento = signal<SeguimientoPublico | null>(null);
  readonly fotos = signal<string[]>([]);

  readonly frecuencias = FRECUENCIAS_ALIMENTACION;
  readonly estadosBienestar = ESTADOS_BIENESTAR;
  readonly nivelesActividad = NIVELES_ACTIVIDAD;

  private token = '';

  readonly form = this.fb.nonNullable.group({
    peso_kg: [null as number | null, [Validators.required, Validators.min(0.1), Validators.max(200)]],
    alimento: ['', [Validators.required, Validators.maxLength(150)]],
    frecuencia_alimentacion: ['', [Validators.required]],
    estado_bienestar: ['', [Validators.required]],
    nivel_actividad: ['', [Validators.required]],
    vacunas_al_dia: [null as boolean | null, [Validators.required]],
    visita_veterinaria: [null as boolean | null, [Validators.required]],
    condiciones_vivienda: ['', [Validators.maxLength(500)]],
    observaciones: ['', [Validators.maxLength(1000)]],
  });

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    if (!this.token) {
      this.noValido.set(true);
      this.cargando.set(false);
      return;
    }
    this.seguimientoService.obtenerPublico(this.token).subscribe({
      next: (res) => {
        this.seguimiento.set(res.data);
        if (res.data.estado === 'COMPLETADO') {
          this.yaCompletado.set(true);
        }
        this.cargando.set(false);
      },
      error: () => {
        this.noValido.set(true);
        this.cargando.set(false);
      },
    });
  }

  async onFotos(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const archivos = Array.from(input.files ?? []);
    input.value = '';
    for (const archivo of archivos) {
      if (this.fotos().length >= MAX_FOTOS) {
        this.snackBar.open(`Máximo ${MAX_FOTOS} fotografías`, 'Cerrar', { duration: 2500 });
        break;
      }
      if (archivo.size > MAX_BYTES) {
        this.snackBar.open(`"${archivo.name}" supera el tamaño permitido (2.5 MB)`, 'Cerrar', {
          duration: 3500,
        });
        continue;
      }
      const dataUrl = await this.leerComoDataUrl(archivo);
      this.fotos.update((f) => [...f, dataUrl]);
    }
  }

  quitarFoto(i: number): void {
    this.fotos.update((f) => f.filter((_, idx) => idx !== i));
  }

  private leerComoDataUrl(archivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(archivo);
    });
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Revisa los campos obligatorios', 'Cerrar', { duration: 3000 });
      return;
    }
    const v = this.form.getRawValue();
    this.enviando.set(true);
    this.seguimientoService
      .responder(this.token, {
        peso_kg: Number(v.peso_kg),
        alimento: v.alimento,
        frecuencia_alimentacion: v.frecuencia_alimentacion as FrecuenciaAlimentacion,
        estado_bienestar: v.estado_bienestar as EstadoBienestar,
        nivel_actividad: v.nivel_actividad as NivelActividad,
        vacunas_al_dia: v.vacunas_al_dia as boolean,
        visita_veterinaria: v.visita_veterinaria as boolean,
        condiciones_vivienda: v.condiciones_vivienda || null,
        observaciones: v.observaciones || null,
        fotos: this.fotos(),
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.enviado.set(true);
        },
        error: () => this.enviando.set(false),
      });
  }
}
