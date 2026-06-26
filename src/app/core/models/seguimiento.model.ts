export type SeguimientoEstado = 'PENDIENTE' | 'COMPLETADO';
export type FrecuenciaAlimentacion = 'UNA' | 'DOS' | 'TRES_MAS' | 'LIBRE';
export type EstadoBienestar = 'BUENO' | 'REGULAR' | 'EN_RIESGO';
export type NivelActividad = 'BAJA' | 'MEDIA' | 'ALTA';

/** Respuesta del adoptante con el estado actual de la mascota. */
export interface RespuestaSeguimiento {
  peso_kg: number | string | null;
  alimento: string | null;
  frecuencia_alimentacion: FrecuenciaAlimentacion | null;
  estado_bienestar: EstadoBienestar | null;
  nivel_actividad: NivelActividad | null;
  vacunas_al_dia: boolean | null;
  visita_veterinaria: boolean | null;
  condiciones_vivienda: string | null;
  observaciones: string | null;
  fotos: string[] | null;
}

/** Fila de la sección "Adoptantes": una adopción completada y su seguimiento. */
export interface AdoptanteSeguimiento extends RespuestaSeguimiento {
  solicitud_id: number;
  mascota_id: number;
  mascota_nombre: string;
  mascota_foto: string | null;
  especie: string;
  raza: string | null;
  refugio_id: number;
  refugio_nombre: string;
  adoptante_id: number | null;
  adoptante_nombre: string;
  adoptante_apellido: string;
  adoptante_email: string | null;
  adoptante_telefono: string | null;
  adoptante_ciudad: string | null;
  es_publica: boolean;
  fecha_adopcion: string | null;
  // Último enlace de seguimiento (null si aún no se ha enviado).
  seguimiento_id: number | null;
  token: string | null;
  seguimiento_estado: SeguimientoEstado | null;
  fecha_envio: string | null;
  fecha_respuesta: string | null;
}

/** Enlace de seguimiento recién generado por el refugio. */
export interface EnlaceSeguimiento {
  id: number;
  solicitud_id: number;
  token: string;
  estado: SeguimientoEstado;
  fecha_envio: string;
}

/** Contexto del enlace público que diligencia el adoptante. */
export interface SeguimientoPublico extends RespuestaSeguimiento {
  id: number;
  token: string;
  estado: SeguimientoEstado;
  fecha_envio: string;
  fecha_respuesta: string | null;
  mascota_id: number;
  mascota_nombre: string;
  mascota_foto: string | null;
  especie: string;
  raza: string | null;
  refugio_nombre: string;
  adoptante_nombre: string | null;
}

/** Payload que el adoptante envía. */
export interface RespuestaSeguimientoInput {
  peso_kg: number;
  alimento: string;
  frecuencia_alimentacion: FrecuenciaAlimentacion;
  estado_bienestar: EstadoBienestar;
  nivel_actividad: NivelActividad;
  vacunas_al_dia: boolean;
  visita_veterinaria: boolean;
  condiciones_vivienda?: string | null;
  observaciones?: string | null;
  fotos: string[];
}

export interface OpcionSeguimiento {
  valor: string;
  etiqueta: string;
}

export const FRECUENCIAS_ALIMENTACION: OpcionSeguimiento[] = [
  { valor: 'UNA', etiqueta: 'Una vez al día' },
  { valor: 'DOS', etiqueta: 'Dos veces al día' },
  { valor: 'TRES_MAS', etiqueta: 'Tres o más veces al día' },
  { valor: 'LIBRE', etiqueta: 'Alimento siempre disponible' },
];

export const ESTADOS_BIENESTAR: OpcionSeguimiento[] = [
  { valor: 'BUENO', etiqueta: 'Bueno — sano y feliz' },
  { valor: 'REGULAR', etiqueta: 'Regular — algunos cuidados pendientes' },
  { valor: 'EN_RIESGO', etiqueta: 'En riesgo — necesita ayuda' },
];

export const NIVELES_ACTIVIDAD: OpcionSeguimiento[] = [
  { valor: 'BAJA', etiqueta: 'Baja — tranquila la mayor parte del día' },
  { valor: 'MEDIA', etiqueta: 'Media — juega y pasea a diario' },
  { valor: 'ALTA', etiqueta: 'Alta — muy activa y enérgica' },
];

export function etiquetaSeguimiento(
  opciones: OpcionSeguimiento[],
  valor: string | null | undefined
): string {
  if (!valor) return '—';
  return opciones.find((o) => o.valor === valor)?.etiqueta ?? valor;
}
