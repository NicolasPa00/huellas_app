import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';
import {
  ApiResponse,
  LoginPayload,
  RegisterPayload,
  SesionResponse,
  Usuario,
} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokens = inject(TokenService);
  private readonly router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Estado de sesion reactivo con signals.
  private readonly _usuario = signal<Usuario | null>(null);
  readonly usuario = this._usuario.asReadonly();
  readonly isAuthenticated = computed(() => this._usuario() !== null);

  constructor() {
    // Si hay un token persistido (solo en navegador), rehidrata el perfil.
    if (this.tokens.accessToken) {
      this.cargarPerfil().subscribe({ error: () => this.limpiarSesion() });
    }
  }

  register(payload: RegisterPayload): Observable<ApiResponse<SesionResponse>> {
    return this.http
      .post<ApiResponse<SesionResponse>>(`${this.apiUrl}/register`, payload)
      .pipe(tap((res) => this.establecerSesion(res.data)));
  }

  login(payload: LoginPayload): Observable<ApiResponse<SesionResponse>> {
    return this.http
      .post<ApiResponse<SesionResponse>>(`${this.apiUrl}/login`, payload)
      .pipe(tap((res) => this.establecerSesion(res.data)));
  }

  forgotPassword(email: string): Observable<ApiResponse<{ token?: string }>> {
    return this.http.post<ApiResponse<{ token?: string }>>(
      `${this.apiUrl}/forgot-password`,
      { email }
    );
  }

  resetPassword(token: string, password: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/reset-password`, {
      token,
      password,
    });
  }

  cargarPerfil(): Observable<ApiResponse<Usuario>> {
    return this.http
      .get<ApiResponse<Usuario>>(`${this.apiUrl}/me`)
      .pipe(tap((res) => this._usuario.set(res.data)));
  }

  logout(): void {
    const refreshToken = this.tokens.refreshToken;
    if (refreshToken) {
      // Revoca la sesion en el backend (best-effort).
      this.http.post(`${this.apiUrl}/logout`, { refreshToken }).subscribe({
        error: () => undefined,
      });
    }
    this.limpiarSesion();
    this.router.navigate(['/login']);
  }

  hasRole(rol: string): boolean {
    return this._usuario()?.roles.includes(rol) ?? false;
  }

  private establecerSesion(data: SesionResponse): void {
    this.tokens.setTokens(data.accessToken, data.refreshToken);
    this._usuario.set(data.usuario);
  }

  private limpiarSesion(): void {
    this.tokens.clear();
    this._usuario.set(null);
  }
}
