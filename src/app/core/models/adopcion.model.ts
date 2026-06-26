/** Mascota publicada en el catalogo de adopcion. */
export interface MascotaDisponible {
  id: number;
  nombre: string;
  refugio_id: number;
  refugio_nombre: string;
  refugio_ciudad: string | null;
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
  foto_principal: string | null;
}

/** Un criterio del desglose de compatibilidad. */
export interface CriterioCompatibilidad {
  criterio: string;
  peso: number;
  obtenido: number;
  nota: string;
}

export interface DetalleCompatibilidad {
  criterios: CriterioCompatibilidad[];
  sin_preferencias: boolean;
}

/** Previsualizacion de compatibilidad (sin persistir). */
export interface CompatibilidadPreview {
  puntaje: number;
  detalle: DetalleCompatibilidad;
  mascota_nombre: string;
}

/** Solicitud en el historial del adoptante. */
export interface SolicitudMia {
  id: number;
  mascota_id: number;
  mascota_nombre: string;
  refugio_nombre: string;
  puntaje_compatibilidad: number | string | null;
  estado_codigo: string;
  estado: string;
  fecha_solicitud: string;
  fecha_resolucion: string | null;
  foto_principal: string | null;
}

/** Cuestionario de adopcion responsable que se envia al refugio. */
export interface FormularioAdopcion {
  // Datos del solicitante
  tipo_duenio: 'CASA_PROPIA' | 'APARTAMENTO' | 'APARTAMENTO_TERRAZA' | 'VIVIENDA_RURAL';
  direccion_residencia: string;
  tipo_vivienda: 'CASA_PATIO_GRANDE' | 'CASA_PATIO_PEQUENO' | 'APARTAMENTO_AMPLIO' | 'APARTAMENTO_PEQUENO';
  espacios_aire_libre: boolean;
  // Estilo de vida
  horas_fuera: 'LT4' | '4A8' | 'GT8';
  otros_animales: boolean;
  otros_animales_detalle?: string | null;
  hay_ninos: boolean;
  ninos_edades?: string | null;
  // Preferencias y capacidad
  experiencia: 'NINGUNA' | 'POCA' | 'MEDIA' | 'MUCHA';
  cubre_gastos: boolean;
  tiempo_paseos: boolean;
  // Compromisos
  acepta_terminos: boolean;
  compromiso_esterilizacion: boolean;
  autoriza_seguimiento: boolean;
}

/** Perfil para el asistente IA (subconjunto del cuestionario). */
export interface PerfilIA {
  tipo_vivienda: FormularioAdopcion['tipo_vivienda'];
  espacios_aire_libre: boolean;
  horas_fuera: FormularioAdopcion['horas_fuera'];
  experiencia: FormularioAdopcion['experiencia'];
  hay_ninos: boolean;
  otros_animales: boolean;
}

/** Mascota recomendada por el asistente IA. */
export interface RecomendacionMascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string | null;
  tamano: string | null;
  tamano_codigo: string | null;
  nivel_energia: string | null;
  energia_codigo: string | null;
  edad_aprox_meses: number | null;
  refugio_nombre: string;
  foto_principal: string | null;
  num_comportamientos: number;
  puntaje: number;
  justificacion: string;
}

export interface RecomendacionResponse {
  perfil_resumen: string;
  recomendaciones: RecomendacionMascota[];
}

/** Solicitud recibida por el dueno de un refugio. */
export interface SolicitudRecibida {
  id: number;
  mascota_id: number;
  mascota_nombre: string;
  refugio_nombre: string;
  adoptante_nombre: string;
  adoptante_apellido: string;
  adoptante_email: string;
  adoptante_telefono?: string | null;
  /** true cuando la solicitud llegó por el sitio público (sin cuenta). */
  es_publica?: boolean;
  puntaje_compatibilidad: number | string | null;
  estado_codigo: string;
  estado: string;
  mensaje: string | null;
  formulario: FormularioAdopcion | null;
  fecha_solicitud: string;
  fecha_resolucion: string | null;
}

/** Detalle completo de una solicitud. */
export interface SolicitudDetalle extends SolicitudRecibida {
  refugio_id: number;
  adoptante_id: number;
  adoptante_telefono: string | null;
  evaluacion_detalle: DetalleCompatibilidad | null;
  foto_principal: string | null;
}

export interface SolicitudInput {
  mascota_id: number;
  mensaje?: string | null;
  formulario: FormularioAdopcion;
}

export type AccionResolucion = 'APROBAR' | 'RECHAZAR' | 'COMPLETAR';
