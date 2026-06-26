import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RefugioService } from '../../../core/services/refugio.service';
import { AuthService } from '../../../core/services/auth.service';

export interface RefugioDialogData {
  id?: number;
}

@Component({
  selector: 'app-refugio-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './refugio-form.html',
  styleUrl: './refugio-form.scss',
})
export class RefugioForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly refugioService = inject(RefugioService);
  private readonly auth = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialogRef = inject(MatDialogRef<RefugioForm>);
  private readonly data = inject<RefugioDialogData>(MAT_DIALOG_DATA, { optional: true });

  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly refugioId = signal<number | null>(null);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(150)]],
    descripcion: [''],
    nit: [''],
    capacidad_maxima: [null as number | null],
    direccion: [''],
    ciudad: [''],
    departamento: [''],
    latitud: [null as number | null],
    longitud: [null as number | null],
    telefono: [''],
    email_contacto: ['', [Validators.email]],
    sitio_web: [''],
  });

  get esEdicion(): boolean {
    return this.refugioId() !== null;
  }

  ngOnInit(): void {
    const id = this.data?.id;
    if (id) {
      this.refugioId.set(id);
      this.cargando.set(true);
      this.refugioService.obtener(id).subscribe({
        next: (res) => {
          const r = res.data;
          this.form.patchValue({
            nombre: r.nombre,
            descripcion: r.descripcion ?? '',
            nit: r.nit ?? '',
            capacidad_maxima: r.capacidad_maxima,
            direccion: r.direccion ?? '',
            ciudad: r.ciudad ?? '',
            departamento: r.departamento ?? '',
            latitud: r.latitud != null ? Number(r.latitud) : null,
            longitud: r.longitud != null ? Number(r.longitud) : null,
            telefono: r.telefono ?? '',
            email_contacto: r.email_contacto ?? '',
            sitio_web: r.sitio_web ?? '',
          });
          this.cargando.set(false);
        },
        error: () => {
          this.cargando.set(false);
          this.dialogRef.close(false);
        },
      });
    }
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    const payload = this.form.getRawValue();
    const id = this.refugioId();

    const peticion$ = id
      ? this.refugioService.actualizar(id, payload)
      : this.refugioService.registrar(payload);

    peticion$.subscribe({
      next: () => {
        this.guardando.set(false);
        this.snackBar.open(
          id ? 'Refugio actualizado' : 'Refugio registrado',
          'Cerrar',
          { duration: 3000 }
        );
        // Al registrar, el usuario obtiene el rol REFUGIO: refrescamos la sesión.
        if (!id) {
          this.auth.cargarPerfil().subscribe({ error: () => undefined });
        }
        this.dialogRef.close(true);
      },
      error: () => this.guardando.set(false),
    });
  }
}
