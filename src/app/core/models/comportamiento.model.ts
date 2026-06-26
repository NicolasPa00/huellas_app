export interface ProblemaComportamiento {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
}

export interface RecomendacionComportamiento {
  titulo: string;
  descripcion: string;
  orden: number;
}

export interface ConsultaComportamientoInput {
  problema_id: number;
  especie_id?: number | null;
  descripcion_sintomas?: string | null;
}

export interface ConsultaResultado {
  problema: ProblemaComportamiento;
  recomendaciones: RecomendacionComportamiento[];
}
