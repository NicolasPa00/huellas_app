/** Opciones del cuestionario de adopcion (reutilizadas por el formulario y la IA). */

export interface Opcion {
  valor: string;
  etiqueta: string;
}

export const TIPO_DUENIO: Opcion[] = [
  { valor: 'CASA_PROPIA', etiqueta: 'Casa propia' },
  { valor: 'APARTAMENTO', etiqueta: 'Apartamento' },
  { valor: 'APARTAMENTO_TERRAZA', etiqueta: 'Apartamento con terraza/balcón' },
  { valor: 'VIVIENDA_RURAL', etiqueta: 'Vivienda rural' },
];

export const TIPO_VIVIENDA: Opcion[] = [
  { valor: 'CASA_PATIO_GRANDE', etiqueta: 'Casa con patio grande' },
  { valor: 'CASA_PATIO_PEQUENO', etiqueta: 'Casa con patio pequeño' },
  { valor: 'APARTAMENTO_AMPLIO', etiqueta: 'Apartamento amplio' },
  { valor: 'APARTAMENTO_PEQUENO', etiqueta: 'Apartamento pequeño' },
];

export const HORAS_FUERA: Opcion[] = [
  { valor: 'LT4', etiqueta: 'Menos de 4 horas' },
  { valor: '4A8', etiqueta: 'Entre 4 y 8 horas' },
  { valor: 'GT8', etiqueta: 'Más de 8 horas' },
];

export const EXPERIENCIA: Opcion[] = [
  { valor: 'NINGUNA', etiqueta: 'Ninguna' },
  { valor: 'POCA', etiqueta: 'Poca' },
  { valor: 'MEDIA', etiqueta: 'Media' },
  { valor: 'MUCHA', etiqueta: 'Mucha' },
];

/** Devuelve la etiqueta legible de un valor dentro de una lista de opciones. */
export function etiquetaDe(opciones: Opcion[], valor: string | null | undefined): string {
  if (!valor) return '—';
  return opciones.find((o) => o.valor === valor)?.etiqueta ?? valor;
}
