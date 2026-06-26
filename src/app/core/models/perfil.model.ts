export interface CatalogoItem {
  id: number;
  codigo?: string;
  nombre: string;
}

export interface RazaItem {
  id: number;
  especie_id: number;
  nombre: string;
}

export interface Catalogos {
  especies: CatalogoItem[];
  tamanos: CatalogoItem[];
  nivelesEnergia: CatalogoItem[];
  tiposVivienda: CatalogoItem[];
  razas: RazaItem[];
  estadosMascota: CatalogoItem[];
  problemasComportamiento: CatalogoItem[];
  estadosSolicitud: CatalogoItem[];
}

export interface DatosPersonales {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  documento_identidad: string | null;
  fecha_nacimiento: string | null;
  direccion: string | null;
  ciudad: string | null;
  tipo_vivienda_id: number | null;
  email_verificado: boolean;
  roles: string[];
}

export interface UpdatePerfil {
  nombre: string;
  apellido: string;
  telefono?: string;
  documento_identidad?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  ciudad?: string;
  tipo_vivienda_id?: number | null;
}

export interface Preferencias {
  especie_id: number | null;
  tamano_id: number | null;
  nivel_energia_id: number | null;
  tiene_patio: boolean;
  tiene_ninos: boolean;
  tiene_otras_mascotas: boolean;
  horas_disponibles_dia: number | null;
  experiencia_previa: boolean;
}
