import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Estado vacío amigable: icono, título, mensaje y slot para CTA. */
@Component({
  selector: 'ui-empty-state',
  imports: [MatIconModule],
  template: `
    <div class="empty">
      <div class="empty__icon"><mat-icon>{{ icono() }}</mat-icon></div>
      <h3 class="hc-h3">{{ titulo() }}</h3>
      @if (mensaje()) {
        <p class="hc-caption">{{ mensaje() }}</p>
      }
      <div class="empty__cta"><ng-content /></div>
    </div>
  `,
  styles: [
    `
      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: var(--hc-space-sm);
        padding: var(--hc-space-2xl) var(--hc-space-lg);
      }
      .empty__icon {
        width: 64px;
        height: 64px;
        border-radius: var(--hc-radius-pill);
        display: grid;
        place-items: center;
        background: var(--hc-color-primary-soft);
        color: var(--hc-color-primary);
        margin-bottom: var(--hc-space-xs);
      }
      .empty__icon mat-icon { font-size: 32px; width: 32px; height: 32px; }
      .empty__cta { margin-top: var(--hc-space-sm); }
    `,
  ],
})
export class UiEmptyState {
  readonly icono = input('inbox');
  readonly titulo = input('');
  readonly mensaje = input('');
}
