import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { PublicoService } from '../../../core/services/publico.service';
import { MascotaPublicaDetalle } from '../../../core/models/publico.model';
import { SolicitudForm } from '../../adopciones/solicitud-form/solicitud-form';
import { edadTexto, mesesDesdeNacimiento } from '../../mascotas/edad.util';
import { aniosDesde, sexoTexto, ubicacionTexto } from '../publico.util';
import { TESTIMONIOS } from '../contenido';
import { UiCard } from '../../../shared/ui/ui-card/ui-card';

@Component({
  selector: 'app-mascota-perfil',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatProgressBarModule, UiCard],
  templateUrl: './mascota-perfil.html',
  styleUrl: './mascota-perfil.scss',
})
export class MascotaPerfil implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly publicoService = inject(PublicoService);
  private readonly dialog = inject(MatDialog);

  readonly cargando = signal(true);
  readonly noEncontrada = signal(false);
  readonly mascota = signal<MascotaPublicaDetalle | null>(null);
  readonly fotoActiva = signal<string | null>(null);

  readonly testimonios = TESTIMONIOS;

  readonly galeria = computed(() => this.mascota()?.fotos ?? []);

  readonly edad = computed(() => {
    const m = this.mascota();
    if (!m) return 'Edad desconocida';
    return edadTexto(mesesDesdeNacimiento(m.fecha_nacimiento) ?? m.edad_aprox_meses);
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      this.noEncontrada.set(true);
      this.cargando.set(false);
      return;
    }
    this.publicoService.mascota(id).subscribe({
      next: (res) => {
        this.mascota.set(res.data);
        const fotos = res.data.fotos ?? [];
        this.fotoActiva.set(fotos[0]?.url ?? null);
        this.cargando.set(false);
      },
      error: () => {
        this.noEncontrada.set(true);
        this.cargando.set(false);
      },
    });
  }

  seleccionarFoto(url: string): void {
    this.fotoActiva.set(url);
  }

  sexo(): string {
    return sexoTexto(this.mascota()?.sexo ?? null);
  }

  ubicacion(): string {
    const m = this.mascota();
    return ubicacionTexto(m?.refugio_ciudad ?? null, m?.refugio_departamento ?? null);
  }

  aniosRefugio(): number {
    return aniosDesde(this.mascota()?.refugio_fecha_creacion);
  }

  vacunacion(): string {
    const v = this.mascota()?.estado_vacunacion;
    const mapa: Record<string, string> = {
      COMPLETO: 'Completo',
      PARCIAL: 'Parcial',
      SIN_VACUNAS: 'Sin vacunas',
    };
    return v ? mapa[v] ?? v : 'No registrado';
  }

  adoptar(): void {
    const m = this.mascota();
    if (!m) return;
    this.dialog.open(SolicitudForm, {
      data: { mascotaId: m.id, mascotaNombre: m.nombre, refugioNombre: m.refugio_nombre },
      width: '620px',
      maxWidth: '95vw',
      autoFocus: false,
    });
  }

  preguntar(): void {
    const m = this.mascota();
    if (!m?.refugio_email) return;
    const asunto = encodeURIComponent(`Consulta sobre ${m.nombre} · Huellas Conectadas`);
    const cuerpo = encodeURIComponent(
      `Hola ${m.refugio_nombre},\n\nMe interesa ${m.nombre} y me gustaría hacer una consulta antes de adoptar.\n\nGracias.`
    );
    window.location.href = `mailto:${m.refugio_email}?subject=${asunto}&body=${cuerpo}`;
  }

  verRefugio(): void {
    const m = this.mascota();
    if (m) this.router.navigate(['/refugios', m.refugio_id]);
  }
}
