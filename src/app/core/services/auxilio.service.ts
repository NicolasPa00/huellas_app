import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import { PeticionAyuda, PeticionAyudaInput } from '../models/auxilio.model';

@Injectable({ providedIn: 'root' })
export class AuxilioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auxilio`;

  /** Pública: registra una petición de ayuda (solicitud inversa). */
  crear(data: PeticionAyudaInput): Observable<ApiResponse<{ id: number }>> {
    return this.http.post<ApiResponse<{ id: number }>>(this.apiUrl, data);
  }

  /** Refugios/administradores: bandeja de peticiones. */
  listar(): Observable<ApiResponse<PeticionAyuda[]>> {
    return this.http.get<ApiResponse<PeticionAyuda[]>>(this.apiUrl);
  }

  cambiarEstado(id: number, estado: 'PENDIENTE' | 'ATENDIDA'): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(`${this.apiUrl}/${id}/estado`, { estado });
  }
}
