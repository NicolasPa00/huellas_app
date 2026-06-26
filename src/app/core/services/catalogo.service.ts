import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import { Catalogos } from '../models/perfil.model';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/catalogos`;

  getCatalogos(): Observable<ApiResponse<Catalogos>> {
    return this.http.get<ApiResponse<Catalogos>>(this.apiUrl);
  }
}
