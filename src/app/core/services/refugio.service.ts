import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import { Refugio, RefugioInput } from '../models/refugio.model';

@Injectable({ providedIn: 'root' })
export class RefugioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/refugios`;

  listarMios(): Observable<ApiResponse<Refugio[]>> {
    return this.http.get<ApiResponse<Refugio[]>>(`${this.apiUrl}/mios`);
  }

  obtener(id: number): Observable<ApiResponse<Refugio>> {
    return this.http.get<ApiResponse<Refugio>>(`${this.apiUrl}/${id}`);
  }

  registrar(data: RefugioInput): Observable<ApiResponse<Refugio>> {
    return this.http.post<ApiResponse<Refugio>>(this.apiUrl, data);
  }

  actualizar(id: number, data: RefugioInput): Observable<ApiResponse<Refugio>> {
    return this.http.put<ApiResponse<Refugio>>(`${this.apiUrl}/${id}`, data);
  }

  desactivar(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
