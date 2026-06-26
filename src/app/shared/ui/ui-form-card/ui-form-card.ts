import { Component, input } from '@angular/core';

/**
 * Contenedor estándar para formularios: card con título, descripción
 * opcional y espaciado consistente. El contenido se proyecta dentro.
 */
@Component({
  selector: 'ui-form-card',
  template: `
    <section class="form-card">
      <div class="form-card__head">
        <h2 class="hc-h2">{{ titulo() }}</h2>
        @if (descripcion()) {
          <p class="hc-caption">{{ descripcion() }}</p>
        }
      </div>
      <div class="form-card__body">
        <ng-content />
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }
      .form-card {
        background: var(--hc-color-surface);
        border: 1px solid var(--hc-color-border);
        border-radius: var(--hc-radius-lg);
        box-shadow: var(--hc-shadow-sm);
        padding: var(--hc-space-lg) var(--hc-space-lg) var(--hc-space-md);
      }
      .form-card__head { margin-bottom: var(--hc-space-md); }
      .form-card__head p { margin-top: var(--hc-space-xs); }
    `,
  ],
})
export class UiFormCard {
  readonly titulo = input('');
  readonly descripcion = input('');
}
