import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RefugioService } from '../../../core/services/refugio.service';
import { Refugio } from '../../../core/models/refugio.model';
import { RefugioForm } from '../refugio-form/refugio-form';
import { RefugioDetalle } from '../refugio-detalle/refugio-detalle';
import { UiPageHeader } from '../../../shared/ui/ui-page-header/ui-page-header';
import { UiCard } from '../../../shared/ui/ui-card/ui-card';
import { UiEmptyState } from '../../../shared/ui/ui-empty-state/ui-empty-state';

@Component({
  selector: 'app-mis-refugios',
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
  templateUrl: './mis-refugios.html',
  styleUrl: './mis-refugios.scss',
})
export class MisRefugios implements OnInit {
  private readonly refugioService = inject(RefugioService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  readonly cargando = signal(false);
  readonly refugios = signal<Refugio[]>([]);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.refugioService.listarMios().subscribe({
      next: (res) => {
        this.refugios.set(res.data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  verDatos(refugio: Refugio): void {
    this.dialog.open(RefugioDetalle, {
      data: { refugio },
      width: '640px',
      maxWidth: '95vw',
      autoFocus: false,
    });
  }

  abrir(id?: number): void {
    const ref = this.dialog.open(RefugioForm, {
      data: { id },
      width: '640px',
      maxWidth: '95vw',
      autoFocus: false,
    });
    ref.afterClosed().subscribe((ok) => {
      if (ok) this.cargar();
    });
  }

  eliminar(refugio: Refugio): void {
    if (!confirm(`¿Desactivar el refugio "${refugio.nombre}"?`)) return;
    this.refugioService.desactivar(refugio.id).subscribe({
      next: () => {
        this.snackBar.open('Refugio desactivado', 'Cerrar', { duration: 3000 });
        this.refugios.set(this.refugios().filter((r) => r.id !== refugio.id));
      },
    });
  }
}
