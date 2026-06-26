import { mesesDesdeNacimiento } from '../mascotas/edad.util';
import { MascotaPublica } from '../../core/models/publico.model';

export type RangoEdad = 'cachorro' | 'joven' | 'adulto' | 'senior';

export interface OpcionRango {
  valor: RangoEdad;
  etiqueta: string;
}

export const RANGOS_EDAD: OpcionRango[] = [
  { valor: 'cachorro', etiqueta: 'Cachorro (< 1 año)' },
  { valor: 'joven', etiqueta: 'Joven (1–2 años)' },
  { valor: 'adulto', etiqueta: 'Adulto (3–7 años)' },
  { valor: 'senior', etiqueta: 'Senior (8+ años)' },
];

/** Meses estimados de una mascota (prioriza fecha de nacimiento). */
export function mesesDeMascota(m: Pick<MascotaPublica, 'fecha_nacimiento' | 'edad_aprox_meses'>): number | null {
  return mesesDesdeNacimiento(m.fecha_nacimiento) ?? m.edad_aprox_meses;
}

/** Clasifica una mascota en un rango de edad. */
export function rangoDeEdad(meses: number | null): RangoEdad | null {
  if (meses == null) return null;
  if (meses < 12) return 'cachorro';
  if (meses < 36) return 'joven';
  if (meses < 96) return 'adulto';
  return 'senior';
}

/**
 * Urgencia heuristica: una mascota que lleva mucho tiempo esperando en el
 * refugio se marca como urgente para darle visibilidad. Sin campo dedicado en
 * el esquema, se deriva de la fecha de ingreso (> 6 meses esperando).
 */
export function esUrgente(fechaIngreso: string | null): boolean {
  if (!fechaIngreso) return false;
  const ingreso = new Date(fechaIngreso);
  if (isNaN(ingreso.getTime())) return false;
  const meses =
    (Date.now() - ingreso.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
  return meses >= 6;
}

/** Etiqueta legible de la ubicacion de una mascota/refugio. */
export function ubicacionTexto(ciudad: string | null, departamento: string | null): string {
  return [ciudad, departamento].filter(Boolean).join(', ') || 'Ubicación no indicada';
}

export function sexoTexto(sexo: string | null): string {
  return sexo === 'M' ? 'Macho' : sexo === 'H' ? 'Hembra' : '—';
}

/** Años de funcionamiento desde la fecha de creación del refugio. */
export function aniosDesde(fechaIso: string | null | undefined): number {
  if (!fechaIso) return 0;
  const d = new Date(fechaIso);
  if (isNaN(d.getTime())) return 0;
  const anios = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, Math.floor(anios));
}
