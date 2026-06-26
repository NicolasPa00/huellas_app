import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const ACCESS_KEY = 'hc_access_token';
const REFRESH_KEY = 'hc_refresh_token';

/**
 * Acceso a tokens en localStorage de forma segura para SSR.
 * En el servidor (donde no existe localStorage) todas las operaciones son no-op.
 */
@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly platformId = inject(PLATFORM_ID);

  private get esNavegador(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get accessToken(): string | null {
    return this.esNavegador ? localStorage.getItem(ACCESS_KEY) : null;
  }

  get refreshToken(): string | null {
    return this.esNavegador ? localStorage.getItem(REFRESH_KEY) : null;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (!this.esNavegador) return;
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  }

  clear(): void {
    if (!this.esNavegador) return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
}
