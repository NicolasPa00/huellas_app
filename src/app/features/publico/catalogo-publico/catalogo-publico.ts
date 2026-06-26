import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { PublicoService } from '../../../core/services/publico.service';
import { MascotaPublica } from '../../../core/models/publico.model';
import { RecomendacionIa } from '../../adopciones/recomendacion-ia/recomendacion-ia';
import { edadTexto } from '../../mascotas/edad.util';
import {
  RANGOS_EDAD,
  RangoEdad,
  esUrgente,
  mesesDeMascota,
  rangoDeEdad,
  sexoTexto,
  ubicacionTexto,
} from '../publico.util';
import { UiCard } from '../../../shared/ui/ui-card/ui-card';
import { UiEmptyState } from '../../../shared/ui/ui-empty-state/ui-empty-state';

interface Opcion {
  id: number;
  nombre: string;
}

type Orden = 'recientes' | 'edad' | 'urgencia';

@Component({
  selector: 'app-catalogo-publico',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatProgressBarModule,
    UiCard,
    UiEmptyState,
  ],
  templateUrl: './catalogo-publico.html',
  styleUrl: './catalogo-publico.scss',
})
export class CatalogoPublico implements OnInit {
  private readonly publicoService = inject(PublicoService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly cargando = signal(false);
  readonly todas = signal<MascotaPublica[]>([]);

  readonly rangosEdad = RANGOS_EDAD;

  // Filtros / orden / busqueda.
  readonly filtroEspecie = signal<number | null>(null);
  readonly filtroTamano = signal<number | null>(null);
  readonly filtroUbicacion = signal<string | null>(null);
  readonly filtroEdad = signal<RangoEdad | null>(null);
  readonly filtroSexo = signal<string | null>(null);
  readonly orden = signal<Orden>('recientes');
  readonly busqueda = signal('');

  readonly especies = computed<Opcion[]>(() => {
    const map = new Map<number, string>();
    for (const m of this.todas()) map.set(m.especie_id, m.especie);
    return [...map.entries()].map(([id, nombre]) => ({ id, nombre })).sort((a, b) => a.nombre.localeCompare(b.nombre));
  });

  readonly tamanos = computed<Opcion[]>(() => {
    const map = new Map<number, string>();
    for (const m of this.todas()) if (m.tamano_id != null && m.tamano) map.set(m.tamano_id, m.tamano);
    return [...map.entries()].map(([id, nombre]) => ({ id, nombre }));
  });

  readonly ubicaciones = computed<string[]>(() => {
    const set = new Set<string>();
    for (const m of this.todas()) if (m.refugio_ciudad) set.add(m.refugio_ciudad);
    return [...set].sort((a, b) => a.localeCompare(b));
  });

  readonly mascotas = computed<MascotaPublica[]>(() => {
    const esp = this.filtroEspecie();
    const tam = this.filtroTamano();
    const ubi = this.filtroUbicacion();
    const edad = this.filtroEdad();
    const sexo = this.filtroSexo();
    const q = this.busqueda().trim().toLowerCase();

    let lista = this.todas().filter((m) => {
      if (esp != null && m.especie_id !== esp) return false;
      if (tam != null && m.tamano_id !== tam) return false;
      if (ubi != null && m.refugio_ciudad !== ubi) return false;
      if (sexo != null && m.sexo !== sexo) return false;
      if (edad != null && rangoDeEdad(mesesDeMascota(m)) !== edad) return false;
      if (q) {
        const enNombre = m.nombre.toLowerCase().includes(q);
        const enCiudad = (m.refugio_ciudad ?? '').toLowerCase().includes(q);
        if (!enNombre && !enCiudad) return false;
      }
      return true;
    });

    const orden = this.orden();
    lista = [...lista].sort((a, b) => {
      if (orden === 'edad') {
        return (mesesDeMascota(a) ?? Infinity) - (mesesDeMascota(b) ?? Infinity);
      }
      if (orden === 'urgencia') {
        return Number(esUrgente(b.fecha_ingreso)) - Number(esUrgente(a.fecha_ingreso));
      }
      // recientes: por fecha de ingreso descendente
      return (b.fecha_ingreso ?? '').localeCompare(a.fecha_ingreso ?? '');
    });
    return lista;
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.publicoService.mascotas().subscribe({
      next: (res) => {
        this.todas.set(res.data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  limpiarFiltros(): void {
    this.filtroEspecie.set(null);
    this.filtroTamano.set(null);
    this.filtroUbicacion.set(null);
    this.filtroEdad.set(null);
    this.filtroSexo.set(null);
    this.busqueda.set('');
    this.orden.set('recientes');
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

  sexo(s: string | null): string {
    return sexoTexto(s);
  }

  urgente(m: MascotaPublica): boolean {
    return esUrgente(m.fecha_ingreso);
  }

  onBusqueda(valor: string): void {
    this.busqueda.set(valor);
  }
}
