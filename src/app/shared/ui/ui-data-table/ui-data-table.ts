import { Component, computed, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UiEmptyState } from '../ui-empty-state/ui-empty-state';

export interface DataColumn {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
}

/** Tabla moderna y reutilizable: cabeceras claras, hover, paginación y estado vacío. */
@Component({
  selector: 'ui-data-table',
  imports: [MatIconModule, MatButtonModule, UiEmptyState],
  template: `
    @if (rows().length === 0) {
      <ui-empty-state [icono]="emptyIcon()" [titulo]="emptyTitulo()" [mensaje]="emptyMensaje()" />
    } @else {
      <div class="table-wrap">
        <table class="ui-table">
          <thead>
            <tr>
              @for (col of columns(); track col.key) {
                <th [style.text-align]="col.align || 'left'">{{ col.label }}</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of pageRows(); track $index) {
              <tr>
                @for (col of columns(); track col.key) {
                  <td [style.text-align]="col.align || 'left'">{{ row[col.key] }}</td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (totalPages() > 1) {
        <div class="pager">
          <span class="hc-caption">Página {{ page() + 1 }} de {{ totalPages() }}</span>
          <span class="pager__btns">
            <button mat-icon-button (click)="prev()" [disabled]="page() === 0" aria-label="Anterior">
              <mat-icon>chevron_left</mat-icon>
            </button>
            <button mat-icon-button (click)="next()" [disabled]="page() === totalPages() - 1" aria-label="Siguiente">
              <mat-icon>chevron_right</mat-icon>
            </button>
          </span>
        </div>
      }
    }
  `,
  styles: [
    `
      :host { display: block; }
      .table-wrap {
        border: 1px solid var(--hc-color-border);
        border-radius: var(--hc-radius-lg);
        overflow: hidden;
        background: var(--hc-color-surface);
      }
      .ui-table { width: 100%; border-collapse: collapse; }
      .ui-table thead th {
        font: var(--hc-text-label);
        color: var(--hc-color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.03em;
        font-size: 0.72rem;
        padding: var(--hc-space-sm) var(--hc-space-md);
        background: var(--hc-color-surface-2);
        border-bottom: 1px solid var(--hc-color-border);
      }
      .ui-table tbody td {
        font: var(--hc-text-body);
        padding: var(--hc-space-md);
        border-bottom: 1px solid var(--hc-color-border);
      }
      .ui-table tbody tr:last-child td { border-bottom: 0; }
      .ui-table tbody tr { transition: background 0.15s ease; }
      .ui-table tbody tr:hover { background: var(--hc-color-surface-2); }
      .pager {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: var(--hc-space-md);
        margin-top: var(--hc-space-sm);
      }
    `,
  ],
})
export class UiDataTable {
  readonly columns = input<DataColumn[]>([]);
  readonly rows = input<Record<string, unknown>[]>([]);
  readonly pageSize = input(8);
  readonly emptyIcon = input('inbox');
  readonly emptyTitulo = input('Sin datos');
  readonly emptyMensaje = input('');

  readonly page = signal(0);
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.rows().length / this.pageSize()))
  );
  readonly pageRows = computed(() => {
    const p = this.page();
    const s = this.pageSize();
    return this.rows().slice(p * s, p * s + s);
  });

  prev(): void {
    this.page.set(Math.max(0, this.page() - 1));
  }
  next(): void {
    this.page.set(Math.min(this.totalPages() - 1, this.page() + 1));
  }
}
