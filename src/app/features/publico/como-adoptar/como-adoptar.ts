import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { FAQ_ADOPCION, PASOS_ADOPCION } from '../contenido';
import { UiCard } from '../../../shared/ui/ui-card/ui-card';

@Component({
  selector: 'app-como-adoptar',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatExpansionModule, UiCard],
  templateUrl: './como-adoptar.html',
  styleUrl: './como-adoptar.scss',
})
export class ComoAdoptar {
  readonly pasos = PASOS_ADOPCION;
  readonly faq = FAQ_ADOPCION;
}
