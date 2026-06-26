import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import {
  AdoptanteSeguimiento,
  EnlaceSeguimiento,
  RespuestaSeguimientoInput,
  SeguimientoPublico,
} from '../models/seguimiento.model';

@Injectable({ providedIn: 'root' })
export class SeguimientoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/seguimiento`;

  /** Refugio/admin: adoptantes con el estado de su seguimiento. */
  listarAdoptantes(): Observable<ApiResponse<AdoptanteSeguimiento[]>> {
    return this.http.get<ApiResponse<AdoptanteSeguimiento[]>>(`${this.apiUrl}/adoptantes`);
  }

  /** Refugio/admin: genera (o reutiliza) el enlace de seguimiento. */
  generarEnlace(solicitudId: number): Observable<ApiResponse<EnlaceSeguimiento>> {
    return this.http.post<ApiResponse<EnlaceSeguimiento>>(
      `${this.apiUrl}/solicitud/${solicitudId}`,
      {}
    );
  }

  /** Público: contexto del enlace de seguimiento. */
  obtenerPublico(token: string): Observable<ApiResponse<SeguimientoPublico>> {
    return this.http.get<ApiResponse<SeguimientoPublico>>(`${this.apiUrl}/publico/${token}`);
  }

  /** Público: el adoptante envía el estado actual de la mascota. */
  responder(
    token: string,
    data: RespuestaSeguimientoInput
  ): Observable<ApiResponse<SeguimientoPublico>> {
    return this.http.post<ApiResponse<SeguimientoPublico>>(
      `${this.apiUrl}/publico/${token}`,
      data
    );
  }
}
