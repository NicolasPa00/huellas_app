import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import {
  AccionResolucion,
  CompatibilidadPreview,
  PerfilIA,
  RecomendacionResponse,
  SolicitudDetalle,
  SolicitudInput,
  SolicitudMia,
  SolicitudRecibida,
} from '../models/adopcion.model';

@Injectable({ providedIn: 'root' })
export class AdopcionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/adopciones`;

  crear(data: SolicitudInput): Observable<ApiResponse<SolicitudDetalle>> {
    return this.http.post<ApiResponse<SolicitudDetalle>>(this.apiUrl, data);
  }

  compatibilidad(mascotaId: number): Observable<ApiResponse<CompatibilidadPreview>> {
    return this.http.get<ApiResponse<CompatibilidadPreview>>(
      `${this.apiUrl}/compatibilidad/${mascotaId}`
    );
  }

  recomendar(perfil: PerfilIA): Observable<ApiResponse<RecomendacionResponse>> {
    return this.http.post<ApiResponse<RecomendacionResponse>>(
      `${this.apiUrl}/recomendaciones`,
      perfil
    );
  }

  listarMias(): Observable<ApiResponse<SolicitudMia[]>> {
    return this.http.get<ApiResponse<SolicitudMia[]>>(`${this.apiUrl}/mias`);
  }

  listarRecibidas(): Observable<ApiResponse<SolicitudRecibida[]>> {
    return this.http.get<ApiResponse<SolicitudRecibida[]>>(`${this.apiUrl}/recibidas`);
  }

  obtener(id: number): Observable<ApiResponse<SolicitudDetalle>> {
    return this.http.get<ApiResponse<SolicitudDetalle>>(`${this.apiUrl}/${id}`);
  }

  resolver(id: number, accion: AccionResolucion): Observable<ApiResponse<SolicitudDetalle>> {
    return this.http.patch<ApiResponse<SolicitudDetalle>>(`${this.apiUrl}/${id}/estado`, {
      accion,
    });
  }
}
