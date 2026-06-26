import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import {
  EstadisticasPublicas,
  MascotaPublica,
  MascotaPublicaDetalle,
  RefugioPublico,
  RefugioPublicoDetalle,
  SolicitudPublicaInput,
  SolicitudPublicaResponse,
} from '../models/publico.model';
import { PerfilIA, RecomendacionResponse } from '../models/adopcion.model';

@Injectable({ providedIn: 'root' })
export class PublicoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/publico`;

  estadisticas(): Observable<ApiResponse<EstadisticasPublicas>> {
    return this.http.get<ApiResponse<EstadisticasPublicas>>(`${this.apiUrl}/estadisticas`);
  }

  mascotas(): Observable<ApiResponse<MascotaPublica[]>> {
    return this.http.get<ApiResponse<MascotaPublica[]>>(`${this.apiUrl}/mascotas`);
  }

  mascota(id: number): Observable<ApiResponse<MascotaPublicaDetalle>> {
    return this.http.get<ApiResponse<MascotaPublicaDetalle>>(`${this.apiUrl}/mascotas/${id}`);
  }

  refugios(): Observable<ApiResponse<RefugioPublico[]>> {
    return this.http.get<ApiResponse<RefugioPublico[]>>(`${this.apiUrl}/refugios`);
  }

  refugio(id: number): Observable<ApiResponse<RefugioPublicoDetalle>> {
    return this.http.get<ApiResponse<RefugioPublicoDetalle>>(`${this.apiUrl}/refugios/${id}`);
  }

  crearSolicitud(data: SolicitudPublicaInput): Observable<ApiResponse<SolicitudPublicaResponse>> {
    return this.http.post<ApiResponse<SolicitudPublicaResponse>>(`${this.apiUrl}/solicitudes`, data);
  }

  recomendar(perfil: PerfilIA): Observable<ApiResponse<RecomendacionResponse>> {
    return this.http.post<ApiResponse<RecomendacionResponse>>(
      `${this.apiUrl}/recomendaciones`,
      perfil
    );
  }
}
