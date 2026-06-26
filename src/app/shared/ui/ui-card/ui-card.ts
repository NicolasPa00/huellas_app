import { Component, input } from '@angular/core';

/** Card base reutilizable: borde suave, elevación ligera, hover opcional. */
@Component({
  selector: 'ui-card',
  template: `<div class="ui-card" [class.ui-card--hover]="hover()" [class.ui-card--flush]="flush()">
    <ng-content />
  </div>`,
  styles: [
    `
      :host { display: block; }
      .ui-card {
        background: var(--hc-color-surface);
        border: 1px solid var(--hc-color-border);
        border-radius: var(--hc-radius-lg);
        box-shadow: var(--hc-shadow-sm);
        padding: var(--hc-space-lg);
      }
      .ui-card--flush { padding: 0; overflow: hidden; }
      .ui-card--hover { transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease; }
      .ui-card--hover:hover {
        box-shadow: var(--hc-shadow-md);
        transform: translateY(-2px);
        border-color: #dfe5e2;
      }
    `,
  ],
})
export class UiCard {
  readonly hover = input(false);
  readonly flush = input(false);
}
