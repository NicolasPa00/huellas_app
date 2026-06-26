import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import {
  ConsultaComportamientoInput,
  ConsultaResultado,
  ProblemaComportamiento,
} from '../models/comportamiento.model';

@Injectable({ providedIn: 'root' })
export class ComportamientoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/comportamiento`;

  problemas(): Observable<ApiResponse<ProblemaComportamiento[]>> {
    return this.http.get<ApiResponse<ProblemaComportamiento[]>>(`${this.apiUrl}/problemas`);
  }

  consultar(data: ConsultaComportamientoInput): Observable<ApiResponse<ConsultaResultado>> {
    return this.http.post<ApiResponse<ConsultaResultado>>(`${this.apiUrl}/consultas`, data);
  }
}
