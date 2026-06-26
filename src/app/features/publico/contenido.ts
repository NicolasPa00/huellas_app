/**
 * Contenido curado (estatico) de la seccion publica de adopcion.
 * Centraliza textos y datos de marketing reutilizados por home, perfil,
 * "como adoptar" y el footer. El esquema no modela testimonios/redes, por lo
 * que viven aqui como contenido editorial del MVP.
 */

export interface PasoProceso {
  numero: number;
  icono: string;
  titulo: string;
  descripcion: string;
}

export interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

export interface Testimonio {
  mascota: string;
  adoptante: string;
  ciudad: string;
  texto: string;
  emoji: string;
}

export interface RedSocial {
  nombre: string;
  icono: string;
  url: string;
}

/** Áreas de fortaleza de las veterinarias (asesoría avanzada del asistente). */
export interface AreaVeterinaria {
  codigo: string;
  etiqueta: string;
  icono: string;
}

export const AREAS_VETERINARIA: AreaVeterinaria[] = [
  { codigo: 'COMPORTAMIENTO', etiqueta: 'Comportamiento', icono: 'psychology' },
  { codigo: 'NUTRICION', etiqueta: 'Nutrición', icono: 'restaurant' },
  { codigo: 'REHABILITACION', etiqueta: 'Rehabilitación', icono: 'healing' },
  { codigo: 'URGENCIAS', etiqueta: 'Urgencias 24h', icono: 'emergency' },
  { codigo: 'GERIATRIA', etiqueta: 'Geriatría', icono: 'elderly' },
];

export interface Veterinaria {
  nombre: string;
  ciudad: string;
  areas: string[];
  telefono: string;
  direccion: string;
  descripcion: string;
}

/**
 * Catálogo curado de veterinarias especializadas (contenido editorial del MVP;
 * el esquema no modela veterinarias). Cada una destaca sus áreas de fortaleza.
 */
export const VETERINARIAS: Veterinaria[] = [
  {
    nombre: 'Centro Veterinario Patitas',
    ciudad: 'Bogotá',
    areas: ['COMPORTAMIENTO', 'NUTRICION'],
    telefono: '+57 601 000 1001',
    direccion: 'Cra. 15 # 80-25',
    descripcion: 'Etología clínica y planes nutricionales personalizados para perros y gatos.',
  },
  {
    nombre: 'Clínica Animal Vida',
    ciudad: 'Medellín',
    areas: ['REHABILITACION', 'URGENCIAS'],
    telefono: '+57 604 000 1002',
    direccion: 'Cl. 10 # 43-12',
    descripcion: 'Fisioterapia, rehabilitación postquirúrgica y atención de urgencias 24 horas.',
  },
  {
    nombre: 'VetSalud Especializada',
    ciudad: 'Cali',
    areas: ['COMPORTAMIENTO', 'GERIATRIA'],
    telefono: '+57 602 000 1003',
    direccion: 'Av. 6N # 23-40',
    descripcion: 'Modificación de conducta y cuidado integral para mascotas mayores.',
  },
  {
    nombre: 'Hospital Veterinario Huellas',
    ciudad: 'Bogotá',
    areas: ['URGENCIAS', 'REHABILITACION'],
    telefono: '+57 601 000 1004',
    direccion: 'Cl. 100 # 19-54',
    descripcion: 'Urgencias, hospitalización y terapias de recuperación con equipo multidisciplinar.',
  },
  {
    nombre: 'Nutrivet Animal',
    ciudad: 'Barranquilla',
    areas: ['NUTRICION', 'GERIATRIA'],
    telefono: '+57 605 000 1005',
    direccion: 'Cra. 53 # 75-30',
    descripcion: 'Nutrición clínica, control de peso y dietas para enfermedades crónicas.',
  },
  {
    nombre: 'Conducta Animal Pro',
    ciudad: 'Medellín',
    areas: ['COMPORTAMIENTO', 'REHABILITACION'],
    telefono: '+57 604 000 1006',
    direccion: 'Cra. 70 # 44-18',
    descripcion: 'Especialistas en ansiedad, agresividad y reeducación con refuerzo positivo.',
  },
];

export const PASOS_ADOPCION: PasoProceso[] = [
  {
    numero: 1,
    icono: 'search',
    titulo: 'Explora las mascotas disponibles',
    descripcion: 'Navega el catálogo, usa los filtros o el asistente IA para encontrar a tu compañero ideal.',
  },
  {
    numero: 2,
    icono: 'assignment',
    titulo: 'Completa el formulario de solicitud',
    descripcion: 'Cuéntanos sobre ti y tu hogar respondiendo el cuestionario de adopción responsable.',
  },
  {
    numero: 3,
    icono: 'fact_check',
    titulo: 'El refugio revisa tu solicitud',
    descripcion: 'El equipo del refugio evalúa la compatibilidad y se pone en contacto contigo.',
  },
  {
    numero: 4,
    icono: 'groups',
    titulo: 'Entrevista o visita',
    descripcion: 'Conoces a la mascota en persona y resuelves todas tus dudas con el refugio.',
  },
  {
    numero: 5,
    icono: 'history_edu',
    titulo: 'Firma del contrato de adopción responsable',
    descripcion: 'Formalizas el compromiso de cuidado, esterilización y seguimiento.',
  },
  {
    numero: 6,
    icono: 'home',
    titulo: '¡Tu nuevo compañero llega a casa!',
    descripcion: 'Le das la bienvenida a tu hogar y comienza una nueva historia juntos.',
  },
];

export const FAQ_ADOPCION: PreguntaFrecuente[] = [
  {
    pregunta: '¿Adoptar tiene algún costo?',
    respuesta:
      'La adopción es responsable, no comercial. Algunos refugios solicitan una cuota simbólica de recuperación que cubre vacunas, desparasitación y esterilización. El refugio te informará los detalles durante el proceso.',
  },
  {
    pregunta: '¿Qué requisitos debo cumplir?',
    respuesta:
      'Ser mayor de edad, contar con un espacio adecuado para la mascota y comprometerte con su cuidado, alimentación y atención veterinaria. Cada refugio puede tener requisitos adicionales según la mascota.',
  },
  {
    pregunta: '¿Cuánto tarda el proceso?',
    respuesta:
      'Depende del refugio y de la mascota, pero normalmente entre unos días y un par de semanas: incluye la revisión de la solicitud, una entrevista o visita y la firma del contrato.',
  },
  {
    pregunta: '¿Hay seguimiento después de la adopción?',
    respuesta:
      'Sí. Como parte de la adopción responsable, autorizas un seguimiento por parte del refugio para asegurar el bienestar de la mascota en su nuevo hogar.',
  },
  {
    pregunta: '¿Necesito crear una cuenta para adoptar?',
    respuesta:
      'No. Puedes explorar mascotas, refugios y enviar tu solicitud de adopción sin registrarte. Solo te pediremos tus datos de contacto al momento de enviar la solicitud.',
  },
  {
    pregunta: '¿Puedo adoptar si vivo en apartamento?',
    respuesta:
      '¡Por supuesto! Muchas mascotas se adaptan perfectamente a la vida en apartamento. Usa el asistente IA para encontrar una mascota cuyo tamaño y energía se ajusten a tu espacio.',
  },
];

export const TESTIMONIOS: Testimonio[] = [
  {
    mascota: 'Luna',
    adoptante: 'María José',
    ciudad: 'Bogotá',
    texto:
      'Adoptar a Luna fue la mejor decisión. El proceso fue claro y el refugio nos acompañó en todo momento. Hoy es parte de la familia.',
    emoji: '🐶',
  },
  {
    mascota: 'Simba',
    adoptante: 'Andrés',
    ciudad: 'Medellín',
    texto:
      'Encontré a Simba con el asistente de recomendación. Encajó perfecto con mi estilo de vida. ¡Gracias Huellas Conectadas!',
    emoji: '🐱',
  },
  {
    mascota: 'Toby',
    adoptante: 'Catalina',
    ciudad: 'Cali',
    texto:
      'Siempre quise darle un hogar a un peludo. La plataforma me mostró refugios cercanos y todo fue muy transparente.',
    emoji: '🐾',
  },
];

export const REDES_SOCIALES: RedSocial[] = [
  { nombre: 'Facebook', icono: 'facebook', url: 'https://facebook.com' },
  { nombre: 'Instagram', icono: 'photo_camera', url: 'https://instagram.com' },
  { nombre: 'X', icono: 'tag', url: 'https://x.com' },
];

export const PLATAFORMA = {
  mision:
    'Conectar a mascotas que buscan un hogar con personas dispuestas a darles amor, promoviendo la adopción responsable y el bienestar animal.',
  vision:
    'Un mundo donde ninguna mascota quede sin hogar y cada adopción sea una historia de cuidado, compromiso y felicidad compartida.',
  email: 'hola@huellasconectadas.org',
  telefono: '+57 300 000 0000',
};
