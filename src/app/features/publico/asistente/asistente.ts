import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ComportamientoService } from '../../../core/services/comportamiento.service';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { PublicoService } from '../../../core/services/publico.service';
import {
  ConsultaResultado,
  ProblemaComportamiento,
} from '../../../core/models/comportamiento.model';
import { CatalogoItem } from '../../../core/models/perfil.model';
import { RefugioPublico } from '../../../core/models/publico.model';
import { AREAS_VETERINARIA, VETERINARIAS, Veterinaria } from '../contenido';
import { AuxilioForm } from '../auxilio-form/auxilio-form';
import { UiCard } from '../../../shared/ui/ui-card/ui-card';

type Seccion = 'recomendaciones' | 'veterinarias' | 'refugios';

@Component({
  selector: 'app-asistente',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatTooltipModule,
    UiCard,
  ],
  templateUrl: './asistente.html',
  styleUrl: './asistente.scss',
})
export class Asistente implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly comportamientoService = inject(ComportamientoService);
  private readonly catalogoService = inject(CatalogoService);
  private readonly publicoService = inject(PublicoService);
  private readonly dialog = inject(MatDialog);

  readonly seccion = signal<Seccion>('recomendaciones');

  // --- Recomendaciones de comportamiento ---
  readonly cargando = signal(false);
  readonly consultando = signal(false);
  readonly problemas = signal<ProblemaComportamiento[]>([]);
  readonly especies = signal<CatalogoItem[]>([]);
  readonly seleccionado = signal<ProblemaComportamiento | null>(null);
  readonly resultado = signal<ConsultaResultado | null>(null);

  readonly form = this.fb.nonNullable.group({
    especie_id: [null as number | null],
    descripcion_sintomas: [''],
  });

  // --- Veterinarias especializadas ---
  readonly areas = AREAS_VETERINARIA;
  readonly areaVet = signal<string | null>(null);
  readonly veterinariasFiltradas = computed<Veterinaria[]>(() => {
    const area = this.areaVet();
    return area ? VETERINARIAS.filter((v) => v.areas.includes(area)) : VETERINARIAS;
  });

  // --- Refugios para entrega responsable ---
  readonly cargandoRefugios = signal(false);
  readonly refugios = signal<RefugioPublico[]>([]);

  private readonly iconos: Record<string, string> = {
    ANSIEDAD: 'sentiment_dissatisfied',
    AGRESIVIDAD: 'warning',
    LADRIDOS: 'volume_up',
    DESTRUCCION: 'chair',
    SOCIALIZACION: 'groups',
  };

  ngOnInit(): void {
    this.cargando.set(true);
    this.comportamientoService.problemas().subscribe({
      next: (res) => {
        this.problemas.set(res.data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
    this.catalogoService.getCatalogos().subscribe({
      next: (res) => this.especies.set(res.data.especies),
    });
  }

  irA(seccion: Seccion): void {
    this.seccion.set(seccion);
    if (seccion === 'refugios' && this.refugios().length === 0) {
      this.cargarRefugios();
    }
  }

  abrirAuxilio(): void {
    this.dialog.open(AuxilioForm, { width: '600px', maxWidth: '95vw', autoFocus: false });
  }

  private cargarRefugios(): void {
    this.cargandoRefugios.set(true);
    this.publicoService.refugios().subscribe({
      next: (res) => {
        this.refugios.set(res.data);
        this.cargandoRefugios.set(false);
      },
      error: () => this.cargandoRefugios.set(false),
    });
  }

  // --- Recomendaciones ---
  icono(codigo: string): string {
    return this.iconos[codigo] ?? 'pets';
  }

  seleccionar(p: ProblemaComportamiento): void {
    this.seleccionado.set(p);
    this.resultado.set(null);
  }

  consultar(): void {
    const problema = this.seleccionado();
    if (!problema) return;
    const v = this.form.getRawValue();
    this.consultando.set(true);
    this.comportamientoService
      .consultar({
        problema_id: problema.id,
        especie_id: v.especie_id,
        descripcion_sintomas: v.descripcion_sintomas || null,
      })
      .subscribe({
        next: (res) => {
          this.resultado.set(res.data);
          this.consultando.set(false);
        },
        error: () => this.consultando.set(false),
      });
  }

  reiniciar(): void {
    this.seleccionado.set(null);
    this.resultado.set(null);
    this.form.reset({ especie_id: null, descripcion_sintomas: '' });
  }

  // --- Veterinarias ---
  toggleArea(codigo: string): void {
    this.areaVet.update((a) => (a === codigo ? null : codigo));
  }

  etiquetaArea(codigo: string): string {
    return this.areas.find((a) => a.codigo === codigo)?.etiqueta ?? codigo;
  }
}
