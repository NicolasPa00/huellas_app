import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import { DatosPersonales, Preferencias, UpdatePerfil } from '../models/perfil.model';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/perfil`;

  getPerfil(): Observable<ApiResponse<DatosPersonales>> {
    return this.http.get<ApiResponse<DatosPersonales>>(this.apiUrl);
  }

  actualizarPerfil(data: UpdatePerfil): Observable<ApiResponse<DatosPersonales>> {
    return this.http.put<ApiResponse<DatosPersonales>>(this.apiUrl, data);
  }

  getPreferencias(): Observable<ApiResponse<Preferencias | null>> {
    return this.http.get<ApiResponse<Preferencias | null>>(
      `${this.apiUrl}/preferencias`
    );
  }

  actualizarPreferencias(data: Preferencias): Observable<ApiResponse<Preferencias>> {
    return this.http.put<ApiResponse<Preferencias>>(
      `${this.apiUrl}/preferencias`,
      data
    );
  }
}
