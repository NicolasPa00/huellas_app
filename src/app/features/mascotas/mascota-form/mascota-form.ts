import { Component, OnInit, inject, signal } from '@angular/core';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MascotaService } from '../../../core/services/mascota.service';
import { RefugioService } from '../../../core/services/refugio.service';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { Refugio } from '../../../core/models/refugio.model';
import { Catalogos, RazaItem } from '../../../core/models/perfil.model';
import { MascotaInput } from '../../../core/models/mascota.model';
import { mesesDesdeNacimiento, edadTexto } from '../edad.util';

export interface MascotaDialogData {
  id?: number;
}

@Component({
  selector: 'app-mascota-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressBarModule,
  ],
  templateUrl: './mascota-form.html',
  styleUrl: './mascota-form.scss',
})
export class MascotaForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly mascotaService = inject(MascotaService);
  private readonly refugioService = inject(RefugioService);
  private readonly catalogoService = inject(CatalogoService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialogRef = inject(MatDialogRef<MascotaForm>);
  private readonly data = inject<MascotaDialogData>(MAT_DIALOG_DATA, { optional: true });

  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly mascotaId = signal<number | null>(null);
  readonly refugios = signal<Refugio[]>([]);
  readonly catalogos = signal<Catalogos | null>(null);
  // Imagen adjunta como data URL (base64) para previsualizar y enviar.
  readonly fotoPreview = signal<string | null>(null);

  readonly opcionesVacunacion = [
    { valor: 'COMPLETO', etiqueta: 'Completo' },
    { valor: 'PARCIAL', etiqueta: 'Parcial' },
    { valor: 'SIN_VACUNAS', etiqueta: 'Sin vacunas' },
  ];

  readonly form = this.fb.nonNullable.group({
    refugio_id: [null as number | null, [Validators.required]],
    nombre: ['', [Validators.required, Validators.maxLength(80)]],
    especie_id: [null as number | null, [Validators.required]],
    raza_id: [null as number | null],
    sexo: [''],
    fecha_nacimiento: [''],
    tamano_id: [null as number | null],
    nivel_energia_id: [null as number | null],
    peso_kg: [null as number | null],
    esterilizado: [false],
    estado_vacunacion: [''],
    estado_salud: [''],
    estado_mascota_id: [null as number | null],
    descripcion: [''],
    comportamientos: [[] as number[]],
  });

  get esEdicion(): boolean {
    return this.mascotaId() !== null;
  }

  /** Edad calculada automáticamente a partir de la fecha de nacimiento. */
  get edadCalculada(): string {
    return edadTexto(mesesDesdeNacimiento(this.form.controls.fecha_nacimiento.value));
  }

  get razasFiltradas(): RazaItem[] {
    const especie = this.form.controls.especie_id.value;
    const razas = this.catalogos()?.razas ?? [];
    return especie ? razas.filter((r) => r.especie_id === especie) : [];
  }

  /** Perro y Gato primero; el resto en orden alfabético. */
  get especiesOrdenadas() {
    const especies = this.catalogos()?.especies ?? [];
    const prioridad = ['Perro', 'Gato'];
    return [...especies].sort((a, b) => {
      const ia = prioridad.indexOf(a.nombre);
      const ib = prioridad.indexOf(b.nombre);
      if (ia !== -1 || ib !== -1) {
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      }
      return a.nombre.localeCompare(b.nombre);
    });
  }

  ngOnInit(): void {
    this.form.controls.especie_id.valueChanges.subscribe(() => {
      this.form.controls.raza_id.setValue(null);
    });

    this.refugioService.listarMios().subscribe({
      next: (res) => this.refugios.set(res.data),
    });

    this.catalogoService.getCatalogos().subscribe({
      next: (res) => {
        this.catalogos.set(res.data);
        if (!this.esEdicion && this.form.controls.estado_mascota_id.value == null) {
          const disponible = res.data.estadosMascota.find((e) => e.codigo === 'DISPONIBLE');
          if (disponible) this.form.controls.estado_mascota_id.setValue(disponible.id);
        }
      },
    });

    const id = this.data?.id;
    if (id) {
      this.mascotaId.set(id);
      this.cargarMascota(id);
    }
  }

  private cargarMascota(id: number): void {
    this.cargando.set(true);
    this.mascotaService.obtener(id).subscribe({
      next: (res) => {
        const m = res.data;
        this.form.patchValue({
          refugio_id: m.refugio_id,
          nombre: m.nombre,
          especie_id: m.especie_id,
          raza_id: m.raza_id,
          sexo: m.sexo ?? '',
          fecha_nacimiento: m.fecha_nacimiento ?? '',
          tamano_id: m.tamano_id,
          nivel_energia_id: m.nivel_energia_id,
          peso_kg: m.peso_kg != null ? Number(m.peso_kg) : null,
          esterilizado: m.esterilizado,
          estado_vacunacion: m.estado_vacunacion ?? '',
          estado_salud: m.estado_salud ?? '',
          estado_mascota_id: m.estado_mascota_id,
          descripcion: m.descripcion ?? '',
          comportamientos: m.comportamientos.map((c) => c.problema_id),
        });
        const principal = m.fotos.find((f) => f.es_principal) ?? m.fotos[0];
        this.fotoPreview.set(principal?.url ?? null);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.dialogRef.close(false);
      },
    });
  }

  /** Lee la imagen seleccionada y la guarda como data URL para previsualizar. */
  onArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.snackBar.open('Selecciona un archivo de imagen', 'Cerrar', { duration: 3000 });
      return;
    }
    if (file.size > 2_000_000) {
      this.snackBar.open('La imagen no debe superar 2 MB', 'Cerrar', { duration: 3000 });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.fotoPreview.set(reader.result as string);
    reader.readAsDataURL(file);
    // Permite volver a seleccionar el mismo archivo si se quita y re-agrega.
    input.value = '';
  }

  quitarFoto(): void {
    this.fotoPreview.set(null);
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const fotos = this.fotoPreview() ? [this.fotoPreview() as string] : [];
    const comportamientos = (v.comportamientos || []).map((id) => ({
      problema_id: id,
      severidad: null,
    }));

    const payload: MascotaInput = {
      refugio_id: v.refugio_id as number,
      nombre: v.nombre,
      especie_id: v.especie_id as number,
      raza_id: v.raza_id,
      sexo: v.sexo || null,
      fecha_nacimiento: v.fecha_nacimiento || null,
      // La edad se deriva de la fecha de nacimiento (campo calculado, no editable).
      edad_aprox_meses: mesesDesdeNacimiento(v.fecha_nacimiento),
      tamano_id: v.tamano_id,
      nivel_energia_id: v.nivel_energia_id,
      peso_kg: v.peso_kg,
      esterilizado: v.esterilizado,
      estado_salud: v.estado_salud || null,
      estado_vacunacion: v.estado_vacunacion || null,
      estado_mascota_id: v.estado_mascota_id,
      descripcion: v.descripcion || null,
      fotos,
      comportamientos,
    };

    this.guardando.set(true);
    const id = this.mascotaId();
    const peticion$ = id
      ? this.mascotaService.actualizar(id, payload)
      : this.mascotaService.crear(payload);

    peticion$.subscribe({
      next: () => {
        this.guardando.set(false);
        this.snackBar.open(
          id ? 'Mascota actualizada' : 'Mascota registrada',
          'Cerrar',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: () => this.guardando.set(false),
    });
  }
}
