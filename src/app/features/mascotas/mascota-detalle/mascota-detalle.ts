import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MascotaService } from '../../../core/services/mascota.service';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { MascotaDetalle as MascotaDetalleModel } from '../../../core/models/mascota.model';
import { Catalogos } from '../../../core/models/perfil.model';
import { mesesDesdeNacimiento, edadTexto } from '../edad.util';

export interface MascotaDetalleData {
  id: number;
}

@Component({
  selector: 'app-mascota-detalle',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './mascota-detalle.html',
  styleUrl: './mascota-detalle.scss',
})
export class MascotaDetalle implements OnInit {
  private readonly mascotaService = inject(MascotaService);
  private readonly catalogoService = inject(CatalogoService);
  private readonly data = inject<MascotaDetalleData>(MAT_DIALOG_DATA);

  readonly cargando = signal(true);
  readonly mascota = signal<MascotaDetalleModel | null>(null);
  readonly catalogos = signal<Catalogos | null>(null);

  readonly fotoPrincipal = computed(() => {
    const m = this.mascota();
    if (!m?.fotos?.length) return null;
    const principal = m.fotos.find((f) => f.es_principal) ?? m.fotos[0];
    return principal?.url ?? null;
  });

  readonly edad = computed(() => {
    const m = this.mascota();
    if (!m) return 'Edad desconocida';
    const meses = mesesDesdeNacimiento(m.fecha_nacimiento) ?? m.edad_aprox_meses;
    return edadTexto(meses);
  });

  ngOnInit(): void {
    this.catalogoService.getCatalogos().subscribe({
      next: (res) => this.catalogos.set(res.data),
    });
    this.mascotaService.obtener(this.data.id).subscribe({
      next: (res) => {
        this.mascota.set(res.data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  private nombrePorId(lista: { id: number; nombre: string }[] | undefined, id: number | null): string {
    if (id == null || !lista) return '—';
    return lista.find((x) => x.id === id)?.nombre ?? '—';
  }

  especie(): string {
    return this.nombrePorId(this.catalogos()?.especies, this.mascota()?.especie_id ?? null);
  }
  raza(): string {
    return this.nombrePorId(this.catalogos()?.razas, this.mascota()?.raza_id ?? null);
  }
  tamano(): string {
    return this.nombrePorId(this.catalogos()?.tamanos, this.mascota()?.tamano_id ?? null);
  }
  energia(): string {
    return this.nombrePorId(this.catalogos()?.nivelesEnergia, this.mascota()?.nivel_energia_id ?? null);
  }
  estado(): string {
    return this.nombrePorId(this.catalogos()?.estadosMascota, this.mascota()?.estado_mascota_id ?? null);
  }

  sexo(): string {
    const s = this.mascota()?.sexo;
    return s === 'M' ? 'Macho' : s === 'H' ? 'Hembra' : '—';
  }

  vacunacion(): string {
    const v = this.mascota()?.estado_vacunacion;
    const mapa: Record<string, string> = {
      COMPLETO: 'Completo',
      PARCIAL: 'Parcial',
      SIN_VACUNAS: 'Sin vacunas',
    };
    return v ? mapa[v] ?? v : '—';
  }

  comportamientos(): string[] {
    const m = this.mascota();
    const cat = this.catalogos()?.problemasComportamiento;
    if (!m?.comportamientos?.length || !cat) return [];
    return m.comportamientos.map((c) => this.nombrePorId(cat, c.problema_id));
  }
}
