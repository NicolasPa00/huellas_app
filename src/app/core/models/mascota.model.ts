export interface MascotaLista {
  id: number;
  nombre: string;
  refugio_id: number;
  refugio_nombre: string;
  especie: string;
  raza: string | null;
  tamano: string | null;
  nivel_energia: string | null;
  estado_codigo: string;
  estado: string;
  edad_aprox_meses: number | null;
  estado_vacunacion: string | null;
  foto_principal: string | null;
}

export interface MascotaFoto {
  id?: number;
  url: string;
  es_principal?: boolean;
  orden?: number;
}

export interface MascotaComportamiento {
  problema_id: number;
  severidad: number | null;
}

export interface MascotaDetalle {
  id: number;
  refugio_id: number;
  refugio_nombre: string;
  nombre: string;
  especie_id: number;
  raza_id: number | null;
  sexo: string | null;
  fecha_nacimiento: string | null;
  edad_aprox_meses: number | null;
  tamano_id: number | null;
  nivel_energia_id: number | null;
  peso_kg: number | string | null;
  esterilizado: boolean;
  estado_salud: string | null;
  estado_vacunacion: string | null;
  estado_mascota_id: number;
  descripcion: string | null;
  fotos: MascotaFoto[];
  comportamientos: MascotaComportamiento[];
}

export interface MascotaInput {
  refugio_id: number;
  nombre: string;
  especie_id: number;
  raza_id?: number | null;
  sexo?: string | null;
  fecha_nacimiento?: string | null;
  edad_aprox_meses?: number | null;
  tamano_id?: number | null;
  nivel_energia_id?: number | null;
  peso_kg?: number | null;
  esterilizado?: boolean;
  estado_salud?: string | null;
  estado_vacunacion?: string | null;
  estado_mascota_id?: number | null;
  descripcion?: string | null;
  fotos?: string[];
  comportamientos?: { problema_id: number; severidad?: number | null }[];
}
