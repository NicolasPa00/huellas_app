import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type ConfirmTono = 'primary' | 'success' | 'warn';

export interface ConfirmDialogData {
  titulo: string;
  mensaje: string;
  confirmar?: string;
  cancelar?: string;
  icono?: string;
  tono?: ConfirmTono;
}

/**
 * Diálogo de confirmación con identidad de marca (huellas + paleta cálida),
 * en reemplazo del `confirm()` nativo del navegador. Devuelve `true`/`false`.
 */
@Component({
  selector: 'ui-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm" [attr.data-tono]="data.tono || 'primary'">
      <!-- Huellas decorativas de fondo -->
      <div class="confirm__huellas" aria-hidden="true">
        <mat-icon>pets</mat-icon>
        <mat-icon>pets</mat-icon>
        <mat-icon>pets</mat-icon>
        <mat-icon>pets</mat-icon>
      </div>

      <div class="confirm__hero">
        <mat-icon>{{ data.icono || 'pets' }}</mat-icon>
      </div>

      <h2 class="confirm__title">{{ data.titulo }}</h2>
      <p class="confirm__msg">{{ data.mensaje }}</p>

      <div class="confirm__actions">
        <button mat-stroked-button (click)="cerrar(false)">
          {{ data.cancelar || 'Cancelar' }}
        </button>
        <button mat-flat-button class="confirm__ok" (click)="cerrar(true)">
          <mat-icon>check_circle</mat-icon>
          {{ data.confirmar || 'Confirmar' }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .confirm {
        position: relative;
        overflow: hidden;
        text-align: center;
        padding: var(--hc-space-xl) var(--hc-space-lg) var(--hc-space-lg);
        --tono-color: var(--hc-color-primary);
        --tono-strong: var(--hc-color-primary-strong);
        --tono-soft: var(--hc-color-primary-soft);
      }
      .confirm[data-tono='success'] {
        --tono-color: var(--hc-color-success);
        --tono-strong: var(--hc-color-success);
        --tono-soft: var(--hc-color-success-soft);
      }
      .confirm[data-tono='warn'] {
        --tono-color: var(--hc-color-secondary);
        --tono-strong: var(--hc-color-secondary-strong);
        --tono-soft: var(--hc-color-secondary-soft);
      }

      .confirm__huellas {
        position: absolute;
        inset: 0;
        pointer-events: none;
        color: var(--tono-color);
        opacity: 0.08;
      }
      .confirm__huellas mat-icon {
        position: absolute;
        font-size: 46px;
        width: 46px;
        height: 46px;
      }
      .confirm__huellas mat-icon:nth-child(1) { top: -8px; left: 12px; transform: rotate(-18deg); }
      .confirm__huellas mat-icon:nth-child(2) { top: 30px; right: 6px; transform: rotate(22deg); font-size: 32px; }
      .confirm__huellas mat-icon:nth-child(3) { bottom: 18px; left: -6px; transform: rotate(12deg); font-size: 38px; }
      .confirm__huellas mat-icon:nth-child(4) { bottom: -6px; right: 28px; transform: rotate(-14deg); }

      .confirm__hero {
        position: relative;
        width: 64px;
        height: 64px;
        margin: 0 auto var(--hc-space-md);
        border-radius: var(--hc-radius-pill);
        display: grid;
        place-items: center;
        background: var(--tono-soft);
        color: var(--tono-strong);
      }
      .confirm__hero mat-icon {
        font-size: 34px;
        width: 34px;
        height: 34px;
      }

      .confirm__title {
        position: relative;
        font: var(--hc-text-h2);
        font-weight: 800;
        color: var(--hc-color-text);
        margin: 0 0 var(--hc-space-xs);
      }
      .confirm__msg {
        position: relative;
        font: var(--hc-text-body);
        color: var(--hc-color-text-muted);
        margin: 0 auto var(--hc-space-lg);
        max-width: 36ch;
      }

      .confirm__actions {
        position: relative;
        display: flex;
        justify-content: center;
        gap: var(--hc-space-sm);
        flex-wrap: wrap;
      }
      .confirm__ok {
        background: var(--tono-color);
        color: #fff;
      }
      .confirm__ok:hover {
        background: var(--tono-strong);
      }
    `,
  ],
})
export class UiConfirmDialog {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<UiConfirmDialog>);

  cerrar(resultado: boolean): void {
    this.dialogRef.close(resultado);
  }
}
