/** Meses transcurridos desde una fecha de nacimiento ISO (YYYY-MM-DD). */
export function mesesDesdeNacimiento(fechaIso: string | null | undefined): number | null {
  if (!fechaIso) return null;
  const nac = new Date(fechaIso);
  if (isNaN(nac.getTime())) return null;
  const hoy = new Date();
  let meses = (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth());
  if (hoy.getDate() < nac.getDate()) meses -= 1;
  return meses < 0 ? 0 : meses;
}

/** Formatea una cantidad de meses como texto legible (años y meses). */
export function edadTexto(meses: number | null | undefined): string {
  if (meses == null) return 'Edad desconocida';
  if (meses < 1) return 'Menos de 1 mes';
  if (meses < 12) return `${meses} mes(es)`;
  const anios = Math.floor(meses / 12);
  const resto = meses % 12;
  return resto ? `${anios} año(s) ${resto} mes(es)` : `${anios} año(s)`;
}
