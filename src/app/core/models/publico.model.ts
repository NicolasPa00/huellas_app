import { FormularioAdopcion, PerfilIA, RecomendacionResponse } from './adopcion.model';

/** Estadisticas globales para el hero de la landing publica. */
export interface EstadisticasPublicas {
  mascotas_disponibles: number;
  adopciones_realizadas: number;
  refugios_participantes: number;
}

/** Mascota en el catalogo publico (lista). */
export interface MascotaPublica {
  id: number;
  nombre: string;
  refugio_id: number;
  refugio_nombre: string;
  refugio_ciudad: string | null;
  refugio_departamento: string | null;
  especie_id: number;
  especie: string;
  raza: string | null;
  tamano_id: number | null;
  tamano: string | null;
  nivel_energia_id: number | null;
  nivel_energia: string | null;
  sexo: string | null;
  fecha_nacimiento: string | null;
  edad_aprox_meses: number | null;
  estado_vacunacion: string | null;
  descripcion: string | null;
  fecha_ingreso: string | null;
  foto_principal: string | null;
}

export interface MascotaFotoPublica {
  id: number;
  url: string;
  es_principal: boolean;
  orden: number;
}

export interface ComportamientoPublico {
  codigo: string;
  nombre: string;
  severidad: number | null;
}

export interface VacunaPublica {
  nombre: string;
  fecha_aplicacion: string | null;
}

/** Perfil completo publico de una mascota. */
export interface MascotaPublicaDetalle {
  id: number;
  nombre: string;
  especie_id: number;
  especie: string;
  raza_id: number | null;
  raza: string | null;
  sexo: string | null;
  fecha_nacimiento: string | null;
  edad_aprox_meses: number | null;
  tamano_id: number | null;
  tamano: string | null;
  nivel_energia_id: number | null;
  nivel_energia: string | null;
  peso_kg: number | string | null;
  esterilizado: boolean;
  estado_salud: string | null;
  estado_vacunacion: string | null;
  estado_codigo: string;
  estado: string;
  descripcion: string | null;
  fecha_ingreso: string | null;
  // Refugio
  refugio_id: number;
  refugio_nombre: string;
  refugio_descripcion: string | null;
  refugio_ciudad: string | null;
  refugio_departamento: string | null;
  refugio_direccion: string | null;
  refugio_telefono: string | null;
  refugio_email: string | null;
  refugio_sitio_web: string | null;
  refugio_verificado: boolean;
  refugio_fecha_creacion: string;
  refugio_adopciones: number;
  // Colecciones
  fotos: MascotaFotoPublica[];
  comportamientos: ComportamientoPublico[];
  vacunas: VacunaPublica[];
}

/** Refugio en el listado publico. */
export interface RefugioPublico {
  id: number;
  nombre: string;
  descripcion: string | null;
  ciudad: string | null;
  departamento: string | null;
  telefono: string | null;
  email_contacto: string | null;
  sitio_web: string | null;
  verificado: boolean;
  fecha_creacion: string;
  mascotas_disponibles: number;
  adopciones_realizadas: number;
}

/** Perfil de refugio publico + sus mascotas disponibles. */
export interface RefugioPublicoDetalle extends RefugioPublico {
  direccion: string | null;
  mascotas: MascotaPublica[];
}

/** Datos de contacto del solicitante publico (sin cuenta). */
export interface ContactoSolicitante {
  nombre: string;
  email: string;
  telefono: string;
}

/** Payload de una solicitud de adopcion publica. */
export interface SolicitudPublicaInput {
  mascota_id: number;
  contacto: ContactoSolicitante;
  mensaje?: string | null;
  formulario: FormularioAdopcion;
}

export interface SolicitudPublicaResponse {
  id: number;
  puntaje: number;
}

export type { PerfilIA, RecomendacionResponse };
