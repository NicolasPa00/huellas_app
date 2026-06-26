export type NivelEmergencia = 'URGENTE' | 'IMPOSIBLE_MANTENER' | 'PREVENTIVO';
export type MotivoAyuda = 'VIAJE' | 'ECONOMICO' | 'SALUD' | 'MUDANZA' | 'OTRO';

export interface PeticionAyudaInput {
  contacto_nombre: string;
  contacto_telefono: string;
  contacto_email?: string | null;
  ciudad?: string | null;
  nivel_emergencia: NivelEmergencia;
  motivo?: MotivoAyuda | null;
  descripcion?: string | null;
}

export interface PeticionAyuda {
  id: number;
  contacto_nombre: string;
  contacto_telefono: string;
  contacto_email: string | null;
  ciudad: string | null;
  nivel_emergencia: NivelEmergencia;
  motivo: MotivoAyuda | null;
  descripcion: string | null;
  estado: 'PENDIENTE' | 'ATENDIDA';
  fecha_creacion: string;
  fecha_atencion: string | null;
}

export interface Opcion {
  valor: string;
  etiqueta: string;
}

export const NIVELES_EMERGENCIA: Opcion[] = [
  { valor: 'URGENTE', etiqueta: 'Urgente — necesito ayuda ya' },
  { valor: 'IMPOSIBLE_MANTENER', etiqueta: 'Pronto no podré mantenerla' },
  { valor: 'PREVENTIVO', etiqueta: 'Busco orientación preventiva' },
];

export const MOTIVOS_AYUDA: Opcion[] = [
  { valor: 'VIAJE', etiqueta: 'Viaje / mudanza al exterior' },
  { valor: 'ECONOMICO', etiqueta: 'Problemas económicos' },
  { valor: 'SALUD', etiqueta: 'Salud (propia o de la mascota)' },
  { valor: 'MUDANZA', etiqueta: 'Cambio de vivienda' },
  { valor: 'OTRO', etiqueta: 'Otro' },
];

export function etiquetaOpcion(opciones: Opcion[], valor: string | null | undefined): string {
  if (!valor) return '—';
  return opciones.find((o) => o.valor === valor)?.etiqueta ?? valor;
}
