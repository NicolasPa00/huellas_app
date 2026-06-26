import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PublicoService } from '../../../core/services/publico.service';
import { MascotaPublica, RefugioPublicoDetalle } from '../../../core/models/publico.model';
import { edadTexto } from '../../mascotas/edad.util';
import { aniosDesde, mesesDeMascota, ubicacionTexto } from '../publico.util';
import { TESTIMONIOS } from '../contenido';
import { UiCard } from '../../../shared/ui/ui-card/ui-card';
import { UiEmptyState } from '../../../shared/ui/ui-empty-state/ui-empty-state';

@Component({
  selector: 'app-refugio-perfil',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    UiCard,
    UiEmptyState,
  ],
  templateUrl: './refugio-perfil.html',
  styleUrl: './refugio-perfil.scss',
})
export class RefugioPerfil implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly publicoService = inject(PublicoService);

  readonly cargando = signal(true);
  readonly noEncontrado = signal(false);
  readonly refugio = signal<RefugioPublicoDetalle | null>(null);

  readonly testimonios = TESTIMONIOS.slice(0, 2);

  readonly mascotas = computed(() => this.refugio()?.mascotas ?? []);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      this.noEncontrado.set(true);
      this.cargando.set(false);
      return;
    }
    this.publicoService.refugio(id).subscribe({
      next: (res) => {
        this.refugio.set(res.data);
        this.cargando.set(false);
      },
      error: () => {
        this.noEncontrado.set(true);
        this.cargando.set(false);
      },
    });
  }

  ubicacion(): string {
    const r = this.refugio();
    return ubicacionTexto(r?.ciudad ?? null, r?.departamento ?? null);
  }

  anios(): number {
    return aniosDesde(this.refugio()?.fecha_creacion);
  }

  edad(m: MascotaPublica): string {
    return edadTexto(mesesDeMascota(m));
  }

  verMascota(m: MascotaPublica): void {
    this.router.navigate(['/mascotas', m.id]);
  }
}
