import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type StatTone = 'primary' | 'secondary' | 'info' | 'warning' | 'success';

/** Tarjeta de métrica para el dashboard. */
@Component({
  selector: 'ui-stat-card',
  imports: [MatIconModule],
  template: `
    <div class="stat">
      <div class="stat__icon" [attr.data-tone]="tono()">
        <mat-icon>{{ icono() }}</mat-icon>
      </div>
      <div class="stat__body">
        <div class="stat__valor">{{ valor() }}</div>
        <div class="stat__label">{{ etiqueta() }}</div>
        @if (tendencia()) {
          <div class="stat__trend">{{ tendencia() }}</div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .stat {
        display: flex;
        align-items: center;
        gap: var(--hc-space-md);
        background: var(--hc-color-surface);
        border: 1px solid var(--hc-color-border);
        border-radius: var(--hc-radius-lg);
        box-shadow: var(--hc-shadow-sm);
        padding: var(--hc-space-lg);
        transition: box-shadow 0.2s ease, transform 0.2s ease;
      }
      .stat:hover { box-shadow: var(--hc-shadow-md); transform: translateY(-2px); }
      .stat__icon {
        width: 48px;
        height: 48px;
        border-radius: var(--hc-radius-md);
        display: grid;
        place-items: center;
        flex-shrink: 0;
        background: var(--hc-color-primary-soft);
        color: var(--hc-color-primary);
      }
      .stat__icon[data-tone='secondary'] { background: var(--hc-color-secondary-soft); color: var(--hc-color-secondary-strong); }
      .stat__icon[data-tone='info'] { background: var(--hc-color-info-soft); color: var(--hc-color-info); }
      .stat__icon[data-tone='warning'] { background: var(--hc-color-warning-soft); color: var(--hc-color-warning); }
      .stat__icon[data-tone='success'] { background: var(--hc-color-success-soft); color: var(--hc-color-success); }
      .stat__valor { font: var(--hc-text-h1); line-height: 1.1; }
      .stat__label { font: var(--hc-text-caption); color: var(--hc-color-text-muted); margin-top: 2px; }
      .stat__trend { font: var(--hc-text-caption); color: var(--hc-color-success); margin-top: var(--hc-space-xs); }
    `,
  ],
})
export class UiStatCard {
  readonly icono = input('insights');
  readonly valor = input<string | number>('');
  readonly etiqueta = input('');
  readonly tendencia = input('');
  readonly tono = input<StatTone>('primary');
}
