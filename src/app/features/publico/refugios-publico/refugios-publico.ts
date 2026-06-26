import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PublicoService } from '../../../core/services/publico.service';
import { RefugioPublico } from '../../../core/models/publico.model';
import { aniosDesde, ubicacionTexto } from '../publico.util';
import { UiCard } from '../../../shared/ui/ui-card/ui-card';
import { UiEmptyState } from '../../../shared/ui/ui-empty-state/ui-empty-state';

@Component({
  selector: 'app-refugios-publico',
  imports: [
    RouterLink,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    UiCard,
    UiEmptyState,
  ],
  templateUrl: './refugios-publico.html',
  styleUrl: './refugios-publico.scss',
})
export class RefugiosPublico implements OnInit {
  private readonly publicoService = inject(PublicoService);

  readonly cargando = signal(false);
  readonly todos = signal<RefugioPublico[]>([]);
  readonly filtroUbicacion = signal<string | null>(null);

  readonly ubicaciones = computed<string[]>(() => {
    const set = new Set<string>();
    for (const r of this.todos()) if (r.ciudad) set.add(r.ciudad);
    return [...set].sort((a, b) => a.localeCompare(b));
  });

  readonly refugios = computed<RefugioPublico[]>(() => {
    const ubi = this.filtroUbicacion();
    return ubi == null ? this.todos() : this.todos().filter((r) => r.ciudad === ubi);
  });

  ngOnInit(): void {
    this.cargando.set(true);
    this.publicoService.refugios().subscribe({
      next: (res) => {
        this.todos.set(res.data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  ubicacion(r: RefugioPublico): string {
    return ubicacionTexto(r.ciudad, r.departamento);
  }

  anios(r: RefugioPublico): number {
    return aniosDesde(r.fecha_creacion);
  }
}
