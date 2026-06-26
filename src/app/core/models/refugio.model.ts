export interface Refugio {
  id: number;
  usuario_id: number;
  nombre: string;
  descripcion: string | null;
  nit: string | null;
  direccion: string | null;
  ciudad: string | null;
  departamento: string | null;
  latitud: number | string | null;
  longitud: number | string | null;
  telefono: string | null;
  email_contacto: string | null;
  sitio_web: string | null;
  capacidad_maxima: number | null;
  verificado: boolean;
  activo: boolean;
  fecha_creacion: string;
}

export interface RefugioInput {
  nombre: string;
  descripcion?: string | null;
  nit?: string | null;
  capacidad_maxima?: number | null;
  direccion?: string | null;
  ciudad?: string | null;
  departamento?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  telefono?: string | null;
  email_contacto?: string | null;
  sitio_web?: string | null;
}
