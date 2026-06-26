import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Refugio } from '../../../core/models/refugio.model';

export interface RefugioDetalleData {
  refugio: Refugio;
}

@Component({
  selector: 'app-refugio-detalle',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './refugio-detalle.html',
  styleUrl: './refugio-detalle.scss',
})
export class RefugioDetalle {
  readonly data = inject<RefugioDetalleData>(MAT_DIALOG_DATA);

  get r(): Refugio {
    return this.data.refugio;
  }
}
