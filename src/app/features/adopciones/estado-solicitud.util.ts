/** Mapea el codigo de estado de una solicitud a una clase de color (badge). */
export function estadoSolicitudClase(codigo: string): string {
  switch (codigo) {
    case 'APROBADA':
    case 'COMPLETADA':
      return 'estado--ok';
    case 'RECHAZADA':
      return 'estado--no';
    case 'EN_REVISION':
      return 'estado--info';
    default: // PENDIENTE
      return 'estado--pend';
  }
}
