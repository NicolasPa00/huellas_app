import { Component, input } from '@angular/core';

/** Encabezado de página: título, descripción opcional y slot de acciones. */
@Component({
  selector: 'ui-page-header',
  template: `
    <header class="ui-page-header">
      <div class="ui-page-header__text">
        <h1 class="hc-h1">{{ titulo() }}</h1>
        @if (descripcion()) {
          <p class="hc-caption">{{ descripcion() }}</p>
        }
      </div>
      <div class="ui-page-header__actions">
        <ng-content select="[actions]" />
      </div>
    </header>
  `,
  styles: [
    `
      .ui-page-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--hc-space-md);
        margin-bottom: var(--hc-space-lg);
        flex-wrap: wrap;
      }
      .ui-page-header__text p { margin-top: var(--hc-space-xs); }
      .ui-page-header__actions {
        display: flex;
        gap: var(--hc-space-sm);
        flex-wrap: wrap;
      }
    `,
  ],
})
export class UiPageHeader {
  readonly titulo = input('');
  readonly descripcion = input('');
}
