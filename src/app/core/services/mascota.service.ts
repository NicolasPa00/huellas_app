import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import { MascotaDetalle, MascotaInput, MascotaLista } from '../models/mascota.model';
import { MascotaDisponible } from '../models/adopcion.model';

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/mascotas`;

  listarMias(): Observable<ApiResponse<MascotaLista[]>> {
    return this.http.get<ApiResponse<MascotaLista[]>>(`${this.apiUrl}/mias`);
  }

  listarDisponibles(filtros: { especie_id?: number; tamano_id?: number } = {}): Observable<
    ApiResponse<MascotaDisponible[]>
  > {
    let params = new HttpParams();
    if (filtros.especie_id) params = params.set('especie_id', filtros.especie_id);
    if (filtros.tamano_id) params = params.set('tamano_id', filtros.tamano_id);
    return this.http.get<ApiResponse<MascotaDisponible[]>>(`${this.apiUrl}/disponibles`, {
      params,
    });
  }

  obtener(id: number): Observable<ApiResponse<MascotaDetalle>> {
    return this.http.get<ApiResponse<MascotaDetalle>>(`${this.apiUrl}/${id}`);
  }

  crear(data: MascotaInput): Observable<ApiResponse<MascotaDetalle>> {
    return this.http.post<ApiResponse<MascotaDetalle>>(this.apiUrl, data);
  }

  actualizar(id: number, data: MascotaInput): Observable<ApiResponse<MascotaDetalle>> {
    return this.http.put<ApiResponse<MascotaDetalle>>(`${this.apiUrl}/${id}`, data);
  }

  eliminar(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
