import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MascotaService } from '../../../core/services/mascota.service';
import { MascotaLista } from '../../../core/models/mascota.model';
import { MascotaForm } from '../mascota-form/mascota-form';
import { MascotaDetalle } from '../mascota-detalle/mascota-detalle';
import { edadTexto } from '../edad.util';
import { UiPageHeader } from '../../../shared/ui/ui-page-header/ui-page-header';
import { UiCard } from '../../../shared/ui/ui-card/ui-card';
import { UiEmptyState } from '../../../shared/ui/ui-empty-state/ui-empty-state';

@Component({
  selector: 'app-mis-mascotas',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    UiPageHeader,
    UiCard,
    UiEmptyState,
  ],
  templateUrl: './mis-mascotas.html',
  styleUrl: './mis-mascotas.scss',
})
export class MisMascotas implements OnInit {
  private readonly mascotaService = inject(MascotaService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  readonly cargando = signal(false);
  readonly mascotas = signal<MascotaLista[]>([]);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.mascotaService.listarMias().subscribe({
      next: (res) => {
        this.mascotas.set(res.data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  abrir(id?: number): void {
    const ref = this.dialog.open(MascotaForm, {
      data: { id },
      width: '720px',
      maxWidth: '95vw',
      autoFocus: false,
    });
    ref.afterClosed().subscribe((ok) => {
      if (ok) this.cargar();
    });
  }

  verDatos(id: number): void {
    this.dialog.open(MascotaDetalle, {
      data: { id },
      width: '640px',
      maxWidth: '95vw',
      autoFocus: false,
    });
  }

  eliminar(mascota: MascotaLista): void {
    if (!confirm(`¿Eliminar a "${mascota.nombre}"?`)) return;
    this.mascotaService.eliminar(mascota.id).subscribe({
      next: () => {
        this.snackBar.open('Mascota eliminada', 'Cerrar', { duration: 3000 });
        this.mascotas.set(this.mascotas().filter((m) => m.id !== mascota.id));
      },
    });
  }

  edad(meses: number | null): string {
    return edadTexto(meses);
  }
}
