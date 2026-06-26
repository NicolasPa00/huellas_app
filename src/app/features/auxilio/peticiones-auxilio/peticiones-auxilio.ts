import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuxilioService } from '../../../core/services/auxilio.service';
import {
  PeticionAyuda,
  NIVELES_EMERGENCIA,
  MOTIVOS_AYUDA,
  etiquetaOpcion,
} from '../../../core/models/auxilio.model';
import { UiPageHeader } from '../../../shared/ui/ui-page-header/ui-page-header';
import { UiCard } from '../../../shared/ui/ui-card/ui-card';
import { UiEmptyState } from '../../../shared/ui/ui-empty-state/ui-empty-state';

@Component({
  selector: 'app-peticiones-auxilio',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    UiPageHeader,
    UiCard,
    UiEmptyState,
  ],
  templateUrl: './peticiones-auxilio.html',
  styleUrl: './peticiones-auxilio.scss',
})
export class PeticionesAuxilio implements OnInit {
  private readonly auxilioService = inject(AuxilioService);
  private readonly snackBar = inject(MatSnackBar);

  readonly cargando = signal(false);
  readonly procesando = signal<number | null>(null);
  readonly peticiones = signal<PeticionAyuda[]>([]);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.auxilioService.listar().subscribe({
      next: (res) => {
        this.peticiones.set(res.data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  nivel(p: PeticionAyuda): string {
    return etiquetaOpcion(NIVELES_EMERGENCIA, p.nivel_emergencia);
  }

  motivo(p: PeticionAyuda): string {
    return etiquetaOpcion(MOTIVOS_AYUDA, p.motivo);
  }

  nivelClase(p: PeticionAyuda): string {
    switch (p.nivel_emergencia) {
      case 'URGENTE':
        return 'nivel--urgente';
      case 'IMPOSIBLE_MANTENER':
        return 'nivel--medio';
      default:
        return 'nivel--bajo';
    }
  }

  cambiar(p: PeticionAyuda, estado: 'PENDIENTE' | 'ATENDIDA'): void {
    this.procesando.set(p.id);
    this.auxilioService.cambiarEstado(p.id, estado).subscribe({
      next: () => {
        this.procesando.set(null);
        this.snackBar.open('Petición actualizada', 'Cerrar', { duration: 3000 });
        this.peticiones.set(
          this.peticiones().map((x) => (x.id === p.id ? { ...x, estado } : x))
        );
      },
      error: () => this.procesando.set(null),
    });
  }
}
