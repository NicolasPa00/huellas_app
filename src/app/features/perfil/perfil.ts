import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UiPageHeader } from '../../shared/ui/ui-page-header/ui-page-header';
import { PerfilService } from '../../core/services/perfil.service';
import { CatalogoService } from '../../core/services/catalogo.service';
import { AuthService } from '../../core/services/auth.service';
import { Catalogos } from '../../core/models/perfil.model';

@Component({
  selector: 'app-perfil',
  imports: [
    ReactiveFormsModule,
    UiPageHeader,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressBarModule,
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly perfilService = inject(PerfilService);
  private readonly catalogoService = inject(CatalogoService);
  private readonly auth = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  readonly cargando = signal(false);
  readonly guardandoDatos = signal(false);
  readonly guardandoPrefs = signal(false);
  readonly email = signal('');
  readonly roles = signal<string[]>([]);
  readonly catalogos = signal<Catalogos | null>(null);

  readonly datosForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.maxLength(100)]],
    telefono: [''],
    documento_identidad: [''],
    fecha_nacimiento: [''],
    direccion: [''],
    ciudad: [''],
    tipo_vivienda_id: [null as number | null],
  });

  readonly prefForm = this.fb.nonNullable.group({
    especie_id: [null as number | null],
    tamano_id: [null as number | null],
    nivel_energia_id: [null as number | null],
    horas_disponibles_dia: [null as number | null],
    tiene_patio: [false],
    tiene_ninos: [false],
    tiene_otras_mascotas: [false],
    experiencia_previa: [false],
  });

  ngOnInit(): void {
    this.cargando.set(true);

    this.catalogoService.getCatalogos().subscribe({
      next: (res) => this.catalogos.set(res.data),
    });

    this.perfilService.getPerfil().subscribe({
      next: (res) => {
        const d = res.data;
        this.email.set(d.email);
        this.roles.set(d.roles);
        this.datosForm.patchValue({
          nombre: d.nombre,
          apellido: d.apellido,
          telefono: d.telefono ?? '',
          documento_identidad: d.documento_identidad ?? '',
          fecha_nacimiento: d.fecha_nacimiento ?? '',
          direccion: d.direccion ?? '',
          ciudad: d.ciudad ?? '',
          tipo_vivienda_id: d.tipo_vivienda_id,
        });
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });

    this.perfilService.getPreferencias().subscribe({
      next: (res) => {
        if (res.data) {
          this.prefForm.patchValue(res.data);
        }
      },
    });
  }

  guardarDatos(): void {
    if (this.datosForm.invalid) {
      this.datosForm.markAllAsTouched();
      return;
    }
    this.guardandoDatos.set(true);
    this.perfilService.actualizarPerfil(this.datosForm.getRawValue()).subscribe({
      next: () => {
        this.guardandoDatos.set(false);
        this.snackBar.open('Datos personales actualizados', 'Cerrar', {
          duration: 3000,
        });
        // Refresca el nombre mostrado en la barra de la app.
        this.auth.cargarPerfil().subscribe({ error: () => undefined });
      },
      error: () => this.guardandoDatos.set(false),
    });
  }

  guardarPreferencias(): void {
    this.guardandoPrefs.set(true);
    this.perfilService.actualizarPreferencias(this.prefForm.getRawValue()).subscribe({
      next: () => {
        this.guardandoPrefs.set(false);
        this.snackBar.open('Preferencias actualizadas', 'Cerrar', { duration: 3000 });
      },
      error: () => this.guardandoPrefs.set(false),
    });
  }
}
