/** Envoltura uniforme de las respuestas del backend. */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  roles: string[];
}

export interface SesionResponse {
  accessToken: string;
  refreshToken: string;
  usuario: Usuario;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  roles: string[];
}

/** Roles del sistema. */
export const ROLES = {
  ADMINISTRADOR: 'ADMINISTRADOR',
  REFUGIO: 'REFUGIO',
  PROPIETARIO: 'PROPIETARIO',
  ADOPTANTE: 'ADOPTANTE',
} as const;
